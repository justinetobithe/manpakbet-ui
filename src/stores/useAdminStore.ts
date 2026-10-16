import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type AdminState = {
    sidebarCollapsed: boolean;
    mobileSidebarOpen: boolean;
    pageSize: number;
};

type AdminActions = {
    toggleSidebar: () => void;
    setMobileSidebar: (open: boolean) => void;
    setPageSize: (size: number) => void;
};

export const useAdminStore = create<AdminState & AdminActions>()(
    persist(
        immer((set) => ({
            sidebarCollapsed: false,
            mobileSidebarOpen: false,
            pageSize: 15,
            toggleSidebar: () =>
                set((state) => {
                    state.sidebarCollapsed = !state.sidebarCollapsed;
                }),
            setMobileSidebar: (open) =>
                set((state) => {
                    state.mobileSidebarOpen = open;
                }),
            setPageSize: (size) =>
                set((state) => {
                    state.pageSize = size;
                }),
        })),
        {
            name: "mpb-admin",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
            partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed, pageSize: state.pageSize }),
        }
    )
);
