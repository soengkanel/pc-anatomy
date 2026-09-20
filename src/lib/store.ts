// This file creates a global "store" (using Zustand) that holds the state of the 3D explorer.
// Any component can read or change this shared state so the whole app stays in sync.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SidebarComponent } from "@/components/motherboard/Sidebar";

// The tabs shown in the detail panel: an overview, the functions, and common issues.
// (The "Why & When to Choose" guidance has moved to the Key Differences modal
// so students can compare choices side by side.)
export type TabId = "overview" | "functions" | "issues";

// The hotspot navigation actions provided by the 3D viewer, so the store can trigger them.
type HotspotNav = {
  next: () => void;
  prev: () => void;
  reset: () => void;
  close: () => void;
};

// Everything the explorer store keeps track of: which component is selected, the active
// tab, and the state of the motherboard "hotspots" (numbered dots on the board).
type ExplorerState = {
  selectedId: string;
  tab: TabId;
  hotspotActive: boolean;
  hotspotPart: SidebarComponent | null;
  hotspotIndex: number;
  hotspotTotal: number;
  select: (id: string) => void;
  setTab: (tab: TabId) => void;
  openHotspot: (part: SidebarComponent, index: number, total: number) => void;
  closeHotspot: () => void;
  setHotspotNav: (nav: HotspotNav) => void;
  nextHotspot: () => void;
  prevHotspot: () => void;
  resetHotspot: () => void;
};

// Create the store and persist part of it (the selected component and tab) to localStorage.
export const useExplorer = create<ExplorerState>()(
  persist(
    (set) => {
      // Holds a reference to the 3D viewer's hotspot controls so we can call them from here.
      const navRef = { current: null as HotspotNav | null };

      return {
        // Default state: the System Unit is selected, and the overview tab is open.
        selectedId: "pc-case",
        tab: "overview",
        hotspotActive: false,
        hotspotPart: null,
        hotspotIndex: 0,
        hotspotTotal: 0,
        // Choose a component in the sidebar; this also clears any open hotspot.
        select: (id) =>
          set({ selectedId: id, hotspotActive: false, hotspotPart: null }),
        // Switch the visible tab of the detail panel.
        setTab: (tab) => set({ tab }),
        // Open a hotspot on the motherboard diagram and remember which part it belongs to.
        openHotspot: (part, index, total) =>
          set({
            hotspotActive: true,
            hotspotPart: part,
            hotspotIndex: index,
            hotspotTotal: total,
          }),
        // Close the hotspot overlay, and ask the 3D viewer to clear its highlight too.
        closeHotspot: () => {
          navRef.current?.close();
          set({
            hotspotActive: false,
            hotspotPart: null,
            hotspotIndex: 0,
            hotspotTotal: 0,
          });
        },
        // Give the store the viewer's navigation functions (called when the viewer mounts).
        setHotspotNav: (nav) => {
          navRef.current = nav;
        },
        // These simply forward to the viewer's own controls.
        nextHotspot: () => navRef.current?.next(),
        prevHotspot: () => navRef.current?.prev(),
        resetHotspot: () => navRef.current?.reset(),
      };
    },
    {
      name: "pc-anatomy-explorer",
      partialize: (state) => ({
        selectedId: state.selectedId,
        tab: state.tab,
      }),
    }
  )
);
