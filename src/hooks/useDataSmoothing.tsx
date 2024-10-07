import { MouseDataPoint, useAppStore } from "../store/store";
import { easingFunctions } from "../utils/easing";

export const useDataSmoothing = () => {
  const {
    setMouseData,
    setSmoothedData,
    timeThreshold,
    accelerationPercentage,
    decelerationPercentage,
    accelerationCurveType,
    decelerationCurveType,
    mouseData,
    resetData,
  } = useAppStore();

  const loadMouseDataFromFile = async (fileName: string) => {
    try {
      const response = await fetch(`/data/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName}`);
      }
      const rawData = await response.json();
      const parsedData = rawData.map(
        ([time, x, y, cursorType]: [number, number, number, string]) => ({
          time,
          x,
          y,
          cursorType,
        })
      );
      resetData();
      setMouseData(parsedData);
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };

  const smoothSegmentWithGaussian = (
    data: MouseDataPoint[]
  ): MouseDataPoint[] => {
    const sigma = 5;
    const kernelSize = Math.ceil(sigma * 3);
    const kernel: number[] = [];
    const smoothed: MouseDataPoint[] = [];
    let sum = 0;

    for (let i = -kernelSize; i <= kernelSize; i++) {
      const value = Math.exp((-0.5 * (i * i)) / (sigma * sigma));
      kernel.push(value);
      sum += value;
    }

    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= sum;
    }

    smoothed.push(data[0]);
    for (let i = 1; i < data.length - 1; i++) {
      let weightedSumX = 0;
      let weightedSumY = 0;

      for (let j = -kernelSize; j <= kernelSize; j++) {
        const index = Math.max(0, Math.min(i + j, data.length - 1));
        weightedSumX += data[index].x * kernel[j + kernelSize];
        weightedSumY += data[index].y * kernel[j + kernelSize];
      }

      smoothed.push({
        ...data[i],
        x: weightedSumX,
        y: weightedSumY,
      });
    }

    smoothed.push(data[data.length - 1]);
    return smoothed;
  };

  const processSmoothing = () => {
    const segments = segmentData(mouseData);
    const smoothedSegments = segments.map((segment) =>
      applyEasingToSegment(
        applyEqualTimeToSegment(smoothSegmentWithGaussian(segment))
      )
    );
    setSmoothedData(smoothedSegments.flat());
  };

  const segmentData = (data: MouseDataPoint[]): MouseDataPoint[][] => {
    const segments: MouseDataPoint[][] = [];
    let currentSegment: MouseDataPoint[] = [data[0]];

    for (let i = 1; i < data.length; i++) {
      const timeDiff = data[i].time - data[i - 1].time;

      if (timeDiff > timeThreshold) {
        if (currentSegment.length > 1) {
          segments.push(currentSegment);
        }
        currentSegment = [data[i]];
      } else {
        currentSegment.push(data[i]);
      }
    }

    if (currentSegment.length > 1) {
      segments.push(currentSegment);
    }

    return segments;
  };

  const applyEqualTimeToSegment = (
    smoothedPoints: MouseDataPoint[]
  ): MouseDataPoint[] => {
    const adjustedSegment: MouseDataPoint[] = [];

    const startPoint = smoothedPoints[0];
    const endPoint = smoothedPoints[smoothedPoints.length - 1];

    const timeDiff = endPoint.time - startPoint.time;
    const numberOfPoints = smoothedPoints.length;

    for (let i = 0; i < numberOfPoints; i++) {
      const t = i / (numberOfPoints - 1);

      const newTimestamp = startPoint.time + t * timeDiff;

      adjustedSegment.push({
        time: newTimestamp,
        x: smoothedPoints[i].x,
        y: smoothedPoints[i].y,
        cursorType: smoothedPoints[i].cursorType,
      });
    }

    return adjustedSegment;
  };

  const applyEasingToSegment = (
    smoothedPoints: MouseDataPoint[]
  ): MouseDataPoint[] => {
    const adjustedSegment: MouseDataPoint[] = [...smoothedPoints];
    const totalPoints = smoothedPoints.length;

    // Total distance
    const totalDistance = smoothedPoints.reduce((acc, point, i) => {
      if (i === 0) return acc;
      const prevPoint = smoothedPoints[i - 1];
      const segmentLength = Math.sqrt(
        Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
      );
      return acc + segmentLength;
    }, 0);

    // Calculate distances for acceleration and deceleration separately
    const accelerationDistance = totalDistance * accelerationPercentage;
    const decelerationDistance = totalDistance * decelerationPercentage;

    let currentDistance = 0;
    let accelerationEndIndex = 0;
    let decelerationStartIndex = totalPoints - 1;

    // Set the subsegment where acceleration and deceleration will be applied
    for (let i = 1; i < totalPoints; i++) {
      const prevPoint = smoothedPoints[i - 1];
      const currentPoint = smoothedPoints[i];
      const segmentLength = Math.sqrt(
        Math.pow(currentPoint.x - prevPoint.x, 2) +
          Math.pow(currentPoint.y - prevPoint.y, 2)
      );

      currentDistance += segmentLength;

      // End of acceleration
      if (
        currentDistance >= accelerationDistance &&
        accelerationEndIndex === 0
      ) {
        accelerationEndIndex = i;
      }
      // Start of deceleration
      if (currentDistance >= totalDistance - decelerationDistance) {
        decelerationStartIndex = i;
        break;
      }
    }

    // Acceleration
    const startTime = smoothedPoints[0].time;
    const accelerationEndTime = smoothedPoints[accelerationEndIndex].time;

    for (let i = 0; i <= accelerationEndIndex; i++) {
      const originalTime = smoothedPoints[i].time;
      const t = (originalTime - startTime) / (accelerationEndTime - startTime);
      const easedT = easingFunctions[accelerationCurveType](t);

      const newTimestamp =
        startTime + easedT * (accelerationEndTime - startTime);

      adjustedSegment[i] = {
        ...smoothedPoints[i],
        time: newTimestamp,
      };
    }

    // Deceleration
    const decelerationStartTime = smoothedPoints[decelerationStartIndex].time;
    const endTime = smoothedPoints[totalPoints - 1].time;

    for (let i = decelerationStartIndex; i < totalPoints; i++) {
      const originalTime = smoothedPoints[i].time;
      const t =
        (originalTime - decelerationStartTime) /
        (endTime - decelerationStartTime);
      const easedT = easingFunctions[decelerationCurveType](t);

      const newTimestamp =
        decelerationStartTime + easedT * (endTime - decelerationStartTime);

      adjustedSegment[i] = {
        ...smoothedPoints[i],
        time: newTimestamp,
      };
    }

    return adjustedSegment;
  };

  return {
    loadMouseDataFromFile,
    processSmoothing,
  };
};
