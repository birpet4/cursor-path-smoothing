import { create } from "zustand";

export interface MouseDataPoint {
  time: number;
  x: number;
  y: number;
  cursorType: string;
}

interface AppStore {
  mouseData: MouseDataPoint[];
  smoothedData: MouseDataPoint[];
  timeThreshold: number;
  accelerationPercentage: number;
  decelerationPercentage: number;
  decelerationCurveType: string;
  accelerationCurveType: string;
  isPlaying: boolean;
  isResetAnimation: boolean;
  setMouseData: (data: MouseDataPoint[]) => void;
  setSmoothedData: (data: MouseDataPoint[]) => void;
  setTimeThreshold: (value: number) => void;
  setAccelerationPercentage: (value: number) => void;
  setDecelerationPercentage: (value: number) => void;
  setAccelerationCurveType: (t: string) => void;
  setDecelerationCurveType: (t: string) => void;
  togglePlay: () => void;
  toggleResetAnimation: () => void;
  resetData: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mouseData: [],
  smoothedData: [],
  timeThreshold: 500,
  accelerationPercentage: 0.25,
  decelerationPercentage: 0.25,
  accelerationCurveType: "easeInQuad",
  decelerationCurveType: "easeOutQuad",
  isPlaying: false,
  isPlayingSmoothed: false,
  isResetAnimation: false,

  setMouseData: (mouseData) => set({ mouseData }),
  setSmoothedData: (smoothedData) => set({ smoothedData }),
  setTimeThreshold: (timeThreshold) => set({ timeThreshold }),
  setAccelerationPercentage: (accelerationPercentage) =>
    set({ accelerationPercentage }),
  setDecelerationPercentage: (decelerationPercentage) =>
    set({ decelerationPercentage }),
  setAccelerationCurveType: (accelerationCurveType) =>
    set({ accelerationCurveType }),
  setDecelerationCurveType: (decelerationCurveType) =>
    set({ decelerationCurveType }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleResetAnimation: () =>
    set((state) => ({ isResetAnimation: !state.isResetAnimation })),
  resetData: () =>
    set({
      mouseData: [],
      smoothedData: [],
      isPlaying: false,
      isResetAnimation: false,
    }),
}));
