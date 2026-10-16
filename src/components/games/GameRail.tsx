"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/Casino";
import GameCard, { GameCardSkeleton } from "./GameCard";

type GameRailProps = {
    games?: Game[];
    loading?: boolean;
    className?: string;
};

export default function GameRail({ games, loading, className }: GameRailProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [edges, setEdges] = React.useState({ start: true, end: false });

    const update = React.useCallback(() => {
        const el = ref.current;
        if (!el) return;
        setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    }, []);

    React.useEffect(() => {
        update();
        const el = ref.current;
        if (!el) return;
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [update, games?.length]);

    const scroll = (direction: 1 | -1) => {
        const el = ref.current;
        if (!el) return;
        el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
    };

    return (
        <div className={cn("group/rail relative", className)}>
            <div ref={ref} onScroll={update} className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth px-3 sm:-mx-0 sm:gap-3 sm:px-0">
                {loading && !games?.length
                    ? Array.from({ length: 8 }).map((_, index) => <GameCardSkeleton key={index} className="w-[31%] shrink-0 sm:w-[22%] md:w-[18%] lg:w-[15%] xl:w-[13.2%]" />)
                    : games?.map((game, index) => (
                          <GameCard key={game.id} game={game} index={index} className="w-[31%] shrink-0 snap-start sm:w-[22%] md:w-[18%] lg:w-[15%] xl:w-[13.2%]" />
                      ))}
            </div>
            <RailButton side="left" hidden={edges.start} onClick={() => scroll(-1)} />
            <RailButton side="right" hidden={edges.end} onClick={() => scroll(1)} />
        </div>
    );
}

function RailButton({ side, hidden, onClick }: { side: "left" | "right"; hidden: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={side === "left" ? "Scroll left" : "Scroll right"}
            className={cn(
                "glass absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-border text-foreground shadow-xl transition hover:border-gold-400/50 hover:text-gold-200 sm:grid",
                side === "left" ? "-left-4" : "-right-4",
                hidden ? "pointer-events-none opacity-0" : "opacity-0 group-hover/rail:opacity-100"
            )}
        >
            {side === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
        </button>
    );
}
