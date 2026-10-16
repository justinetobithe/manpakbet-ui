import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AuthMode = "login" | "register";
export type WalletTab = "deposit" | "withdraw";

type UiState = {
    authOpen: boolean;
    authMode: AuthMode;
    mobileNavOpen: boolean;
    searchOpen: boolean;
    walletOpen: boolean;
    walletTab: WalletTab;
    disclaimerAccepted: boolean;
};

type UiActions = {
    openAuth: (mode?: AuthMode) => void;
    closeAuth: () => void;
    setAuthMode: (mode: AuthMode) => void;
    setMobileNav: (open: boolean) => void;
    setSearch: (open: boolean) => void;
    openWallet: (tab?: WalletTab) => void;
    closeWallet: () => void;
    setWalletTab: (tab: WalletTab) => void;
    acceptDisclaimer: () => void;
};

export const useUiStore = create<UiState & UiActions>()(
    persist(
        immer((set) => ({
            authOpen: false,
            authMode: "login",
            mobileNavOpen: false,
            searchOpen: false,
            walletOpen: false,
            walletTab: "deposit",
            disclaimerAccepted: false,
            openAuth: (mode = "login") =>
                set((state) => {
                    state.authOpen = true;
                    state.authMode = mode;
                    state.mobileNavOpen = false;
                }),
            closeAuth: () =>
                set((state) => {
                    state.authOpen = false;
                }),
            setAuthMode: (mode) =>
                set((state) => {
                    state.authMode = mode;
                }),
            setMobileNav: (open) =>
                set((state) => {
                    state.mobileNavOpen = open;
                }),
            setSearch: (open) =>
                set((state) => {
                    state.searchOpen = open;
                    if (open) state.mobileNavOpen = false;
                }),
            openWallet: (tab = "deposit") =>
                set((state) => {
                    state.walletOpen = true;
                    state.walletTab = tab;
                    state.mobileNavOpen = false;
                }),
            closeWallet: () =>
                set((state) => {
                    state.walletOpen = false;
                }),
            setWalletTab: (tab) =>
                set((state) => {
                    state.walletTab = tab;
                }),
            acceptDisclaimer: () =>
                set((state) => {
                    state.disclaimerAccepted = true;
                }),
        })),
        {
            name: "mpb-ui",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
            partialize: (state) => ({ disclaimerAccepted: state.disclaimerAccepted }),
        }
    )
);
