import { WalletCards } from "lucide-react";
import { AppCard, AppPageHeader } from "@/components/app";
import { PayoutAccountManager } from "@/components/account/PayoutAccounts";

export const metadata = { title: "Payout accounts" };

export default function PayoutAccountsPage() {
    return (
        <div className="space-y-5">
            <AppPageHeader icon={<WalletCards />} title="Payout accounts" description="Manage the GCash and Maya accounts you withdraw to." />
            <AppCard>
                <PayoutAccountManager />
            </AppCard>
        </div>
    );
}
