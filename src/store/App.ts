import { StateSlice } from "./types";

export interface AppStateDefinition {
    isSidebarOpen: boolean;
}

export interface AppStateActions {
    toggleIsSidebarOpen: (open: boolean) => void;
}

export const createAppSlice: StateSlice<AppStateDefinition & AppStateActions> = (set) => ({
    isSidebarOpen: false,
    toggleIsSidebarOpen: (open) =>
        set((state) => {
            state.app.isSidebarOpen = open;
        }),
});
