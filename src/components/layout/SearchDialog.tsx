"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AppEmpty, AppImage } from "@/components/app";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { gameImage } from "@/lib/assets";
import { useGames } from "@/lib/CasinoAPI";
import { useUiStore } from "@/stores";

export default function SearchDialog() {
    const open = useUiStore((state) => state.searchOpen);
    const setOpen = useUiStore((state) => state.setSearch);
    const [term, setTerm] = React.useState("");
    const debounced = useDebouncedValue(term.trim(), 300);

    const results = useGames({ search: debounced, per_page: 18 }, open && debounced.length >= 2);
    const trending = useGames({ sort: "popular", per_page: 12 }, open);

    React.useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
            if (event.key === "/" && !typing) {
                event.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setOpen]);

    const showResults = debounced.length >= 2;
    const list = showResults ? results.data?.data : trending.data?.data;

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
                if (!value) setTerm("");
            }}
        >
            <DialogContent className="surface-strong top-[8%] flex max-h-[84dvh] w-[calc(100vw-1.5rem)] translate-y-0 flex-col gap-0 overflow-hidden rounded-3xl border-border p-0 sm:max-w-2xl [&>button]:hidden">
                <DialogTitle className="sr-only">Search games</DialogTitle>
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <Search className="size-5 text-gold-300" />
                    <input
                        autoFocus
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        placeholder="Search slots, live tables, fishing…"
                        className="h-10 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-fg/10" aria-label="Close search">
                        <X className="size-4" />
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        {showResults ? (
                            <>Results{results.data ? ` · ${results.data.meta.total}` : ""}</>
                        ) : (
                            <>
                                <Flame className="size-3.5 text-ember-400" /> Trending now
                            </>
                        )}
                    </div>
                    {showResults && results.isSuccess && !list?.length ? (
                        <AppEmpty compact title="No games match" description={`We couldn't find anything for “${debounced}”.`} />
                    ) : (
                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                            {(list ?? Array.from({ length: 12 }).map(() => null)).map((game, index) =>
                                game ? (
                                    <Link key={game.id} href={`/play/${game.slug}`} onClick={() => setOpen(false)} className="group space-y-1.5">
                                        <AppImage src={gameImage(game)} alt={game.name} wrapperClassName="aspect-[4/5] rounded-xl ring-1 ring-border transition group-hover:ring-gold-400/50" />
                                        <div className="truncate text-xs font-semibold text-foreground/85 group-hover:text-gold-200">{game.name}</div>
                                    </Link>
                                ) : (
                                    <div key={index} className="aspect-[4/5] animate-pulse rounded-xl bg-fg/5" />
                                )
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
