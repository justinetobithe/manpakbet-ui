import WalletDialog from "@/components/account/WalletDialog";

export default function GameLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <WalletDialog />
        </>
    );
}
