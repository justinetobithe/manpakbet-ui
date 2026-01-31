import { Card } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="panel p-6 text-white">
                <div className="text-2xl font-black">Dashboard</div>
                <div className="mt-2 text-sm text-soft">Show wallet, cash-in, recent bets, notifications here.</div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {["Wallet", "Cash In", "History"].map((t) => (
                    <Card key={t} className="panel p-5 text-white">
                        <div className="text-sm font-semibold">{t}</div>
                        <div className="mt-3 h-24 rounded-2xl bg-white/8" />
                    </Card>
                ))}
            </div>
        </div>
    );
}
