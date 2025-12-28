import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ConfigStore {
  mapPlayComplete: boolean;
  toggle: (key: keyof Omit<ConfigStore, "toggle">) => void;
}

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set) => ({
    mapPlayComplete: false,
    toggle: (key) => set((s) => ({ [key]: !s[key] })),
  }))
);
