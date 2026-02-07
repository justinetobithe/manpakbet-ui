import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import deepmerge from "deepmerge";
import { CombinedState } from "./types";
import { createAppSlice } from "./App";
import { createUserSlice } from "./User";

const useStore = create<CombinedState>()(
    persist(
        immer((...a) => ({
            app: createAppSlice(...a),
            user: createUserSlice(...a),
        })),
        {
            name: "manpakbet-ui",
            partialize: (state) => ({
                app: {
                    isSidebarOpen: state.app.isSidebarOpen,
                },
                user: {
                    user: state.user.user,
                    isAuthenticated: state.user.isAuthenticated,
                },
            }),
            merge: (persistedState, currentState) =>
                deepmerge(currentState, persistedState as Partial<CombinedState>),
        }
    )
);

export default useStore;
