import { create } from "zustand";

interface HeroLoaderState {
  splineReady: boolean;
  setSplineReady: (value: boolean) => void;
}

export const useHeroLoaderStore = create<HeroLoaderState>((set) => ({
  splineReady: false,
  setSplineReady: (value) => set({ splineReady: value }),
}));
