import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { PaymentMethod } from "@/types/Wallet";

type WalletState = {
    hideBalance: boolean;
    preferredMethod: PaymentMethod;
    savedAccountName: string;
    savedAccountNumber: string;
};

type WalletActions = {
    toggleHideBalance: () => void;
    setPreferredMethod: (method: PaymentMethod) => void;
    rememberAccount: (name: string, number: string) => void;
};

export const useWalletStore = create<WalletState & WalletActions>()(
    persist(
        immer((set) => ({
            hideBalance: false,
            preferredMethod: "gcash",
            savedAccountName: "",
            savedAccountNumber: "",
            toggleHideBalance: () =>
                set((state) => {
                    state.hideBalance = !state.hideBalance;
                }),
            setPreferredMethod: (method) =>
                set((state) => {
                    state.preferredMethod = method;
                }),
            rememberAccount: (name, number) =>
                set((state) => {
                    state.savedAccountName = name;
                    state.savedAccountNumber = number;
                }),
        })),
        {
            name: "mpb-wallet",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
);
