import User, { UserStateActions, UserStateDefinition } from "@/types/User";
import { StateSlice } from "./types";

export const createUserSlice: StateSlice<UserStateDefinition & UserStateActions> = (set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user: User | null) =>
        set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
        }),

    clearUser: () =>
        set((state) => {
            state.user = null;
            state.isAuthenticated = false;
        }),

    setAuth: (value: boolean) =>
        set((state) => {
            state.isAuthenticated = value;
        }),
});
