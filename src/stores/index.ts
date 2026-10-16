import { useAdminStore } from "./useAdminStore";
import { useGameStore } from "./useGameStore";
import { useUiStore } from "./useUiStore";
import { useWalletStore } from "./useWalletStore";

export { useAdminStore, useGameStore, useUiStore, useWalletStore };
export { useAuthStore } from "./useAuthStore";

export const rehydrateStores = () =>
    Promise.all([
        useUiStore.persist.rehydrate(),
        useGameStore.persist.rehydrate(),
        useWalletStore.persist.rehydrate(),
        useAdminStore.persist.rehydrate(),
    ]);
