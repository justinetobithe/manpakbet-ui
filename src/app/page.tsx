import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Star, Clock, Trophy, ArrowRight } from "lucide-react";

const chips = [
  { label: "Favourite", icon: Star },
  { label: "Recent", icon: Clock },
  { label: "For You", icon: Flame },
  { label: "Jackpot", icon: Trophy },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-4">
          {chips.map((c) => {
            const Icon = c.icon;
            return (
              <Button
                key={c.label}
                variant="secondary"
                className="h-10 rounded-2xl bg-white/8 text-white hover:bg-white/12"
              >
                <Icon className="mr-2 h-4 w-4" />
                {c.label}
              </Button>
            );
          })}

          <div className="ml-auto">
            <Link href="/auth">
              <Button className="h-10 rounded-2xl bg-gradient-to-r from-primary to-secondary text-black hover:opacity-95">
                Login / Register <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="soft-divider" />

        <div className="grid gap-4 p-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-[16/6] w-full rounded-2xl bg-white/8" />
          </div>
          <div className="grid gap-4">
            <div className="aspect-[16/7] w-full rounded-2xl bg-white/8" />
            <div className="aspect-[16/7] w-full rounded-2xl bg-white/8" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {["Popular Games", "Live Games", "Slot Games", "New Releases"].map((t) => (
          <Card key={t} className="panel p-4 text-white">
            <div className="text-sm font-semibold">{t}</div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl bg-white/8" />
              <div className="aspect-square rounded-2xl bg-white/8" />
              <div className="aspect-square rounded-2xl bg-white/8" />
              <div className="aspect-square rounded-2xl bg-white/8" />
            </div>
          </Card>
        ))}
      </div>

      <div className="panel p-6 text-white">
        <div className="text-sm font-semibold">Official License & Responsible Gaming</div>
        <div className="mt-2 text-sm text-soft">
          This is a UI template. Add your real compliance text, support links, and community icons here.
        </div>
        <div className="mt-6 h-2 w-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent" />
        <div className="mt-3 text-xs text-soft">© {new Date().getFullYear()} ManpakBet</div>
      </div>
    </div>
  );
}
