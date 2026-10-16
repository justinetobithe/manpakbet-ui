"use client";

import { AppDialog } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/stores";
import WalletForm from "./WalletForm";

export default function WalletDialog() {
    const { isAuthenticated } = useAuth();
    const open = useUiStore((state) => state.walletOpen);
    const tab = useUiStore((state) => state.walletTab);
    const close = useUiStore((state) => state.closeWallet);
    const setTab = useUiStore((state) => state.setWalletTab);

    if (!isAuthenticated) return null;

    return (
        <AppDialog open={open} onOpenChange={(value) => (!value ? close() : undefined)} title="Wallet" description="Top up or cash out securely." size="md">
            <WalletForm tab={tab} onTabChange={setTab} onDone={close} compact />
        </AppDialog>
    );
}
