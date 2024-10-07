import { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Graphics, Sprite, useTick } from "@pixi/react";
import * as PIXI from "pixi.js";
import CursorIcon from "../assets/cursor2.webp";
import { Box, Button } from "@mui/material";
import { useAppStore } from "../store/store";

const MousePathDisplay = () => {
  const [cursorTexture, setCursorTexture] = useState<PIXI.Texture | null>(null);
  const {
    mouseData,
    smoothedData,
    isPlaying,
    togglePlay,
    isResetAnimation,
    toggleResetAnimation,
  } = useAppStore();

  // Refs for cursor sprites
  const cursorOriginalRef = useRef<PIXI.Sprite | null>(null);
  const cursorSmoothedRef = useRef<PIXI.Sprite | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);

  const findClosestPoint = (
    data: { time: number; x: number; y: number }[],
    elapsed: number
  ) => {
    return data.find((d) => d.time >= elapsed);
  };

  useTick(() => {
    if (isResetAnimation) {
      resetTimer();
    }
    const currentTime = performance.now();

    // Play both animations simultaneously
    if (isPlaying) {
      if (pausedTimeRef.current !== null) {
        startTimeRef.current = currentTime - pausedTimeRef.current;
        pausedTimeRef.current = null;
      }

      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;

      if (isPlaying) {
        const originalPoint = findClosestPoint(mouseData, elapsed);
        if (originalPoint && cursorOriginalRef.current) {
          cursorOriginalRef.current.x = originalPoint.x;
          cursorOriginalRef.current.y = originalPoint.y;
        }

        const smoothedPoint = findClosestPoint(smoothedData, elapsed);
        if (smoothedPoint && cursorSmoothedRef.current) {
          cursorSmoothedRef.current.x = smoothedPoint.x;
          cursorSmoothedRef.current.y = smoothedPoint.y;
        }
      }

      // Reset start time if the animation reaches the end
      const maxTime = Math.max(
        mouseData[mouseData.length - 1]?.time || 0,
        smoothedData[smoothedData.length - 1]?.time || 0
      );

      if (elapsed >= maxTime) {
        startTimeRef.current = null;
      }
    } else if (
      pausedTimeRef.current === null &&
      startTimeRef.current !== null
    ) {
      pausedTimeRef.current = currentTime - startTimeRef.current;
    }
  });

  // Reset timer function
  const resetTimer = useCallback(() => {
    togglePlay();
    toggleResetAnimation();

    startTimeRef.current = null;
    pausedTimeRef.current = null;
    if (cursorOriginalRef.current) {
      cursorOriginalRef.current.x = mouseData[0]?.x || 0;
      cursorOriginalRef.current.y = mouseData[0]?.y || 0;
    }
    if (cursorSmoothedRef.current) {
      cursorSmoothedRef.current.x = smoothedData[0]?.x || 0;
      cursorSmoothedRef.current.y = smoothedData[0]?.y || 0;
    }
  }, [mouseData, smoothedData, togglePlay, toggleResetAnimation]);

  useEffect(() => {
    if (isResetAnimation) {
      resetTimer();
    }
  }, [resetTimer, isResetAnimation]);

  const width = window.innerWidth * 0.9;
  const height = window.innerHeight;

  useEffect(() => {
    PIXI.Assets.load(CursorIcon).then((texture) => {
      setCursorTexture(texture);
    });
  }, []);

  const drawPath = (
    graphics: PIXI.Graphics,
    points: number[],
    color: number
  ) => {
    graphics.clear();
    graphics.lineStyle(3, color, 1);
    graphics.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) {
      graphics.lineTo(points[i], points[i + 1]);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        margin: "20px auto",
        width: "100%",
        backgroundColor: "#121212",
        borderRadius: "16px",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.4)",
        padding: "20px",
      }}
    >
      <Button variant="contained" onClick={resetTimer}>
        Reset Timer
      </Button>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x121212 }}
      >
        <Graphics
          draw={(graphics) =>
            drawPath(
              graphics,
              mouseData.flatMap((d) => [d.x, d.y]),
              0x2781e7
            )
          }
        />

        <Graphics
          draw={(graphics) =>
            drawPath(
              graphics,
              smoothedData.flatMap((d) => [d.x, d.y]),
              0x00ff00
            )
          }
        />

        {cursorTexture && (
          <>
            <Sprite
              texture={cursorTexture}
              x={mouseData[0]?.x || 0}
              y={mouseData[0]?.y || 0}
              anchor={0.1}
              scale={0.02}
              ref={cursorOriginalRef}
            />
            <Sprite
              texture={cursorTexture}
              x={smoothedData[0]?.x || 0}
              y={smoothedData[0]?.y || 0}
              anchor={0.1}
              scale={0.02}
              ref={cursorSmoothedRef}
            />
          </>
        )}
      </Stage>
    </Box>
  );
};

export default MousePathDisplay;
