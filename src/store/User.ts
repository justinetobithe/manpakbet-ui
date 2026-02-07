import User, { UserStateActions, UserStateDefinition } from "@/types/User";
import { StateSlice } from "./types";

export const createUserSlice: StateSlice<UserStateDefinition & UserStateActions> = (set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user: User | null) =>
        set((state) => {
            state.user.user = user;
            state.user.isAuthenticated = !!user;
        }),

    clearUser: () =>
        set((state) => {
            state.user.user = null;
            state.user.isAuthenticated = false;
        }),

    setAuth: (value: boolean) =>
        set((state) => {
            state.user.isAuthenticated = value;
        }),
});
