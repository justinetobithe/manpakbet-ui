import { cn } from "@/lib/utils";
import type { Game } from "@/types/Casino";
import GameCard, { GameCardSkeleton } from "./GameCard";

type GameGridProps = {
    games?: Game[];
    loading?: boolean;
    skeletonCount?: number;
    className?: string;
};

export const gameGridClass = "grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-2.5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8";

export default function GameGrid({ games, loading, skeletonCount = 14, className }: GameGridProps) {
    return (
        <div className={cn(gameGridClass, className)}>
            {loading && !games?.length
                ? Array.from({ length: skeletonCount }).map((_, index) => <GameCardSkeleton key={index} />)
                : games?.map((game, index) => <GameCard key={game.id} game={game} index={index} compact />)}
        </div>
    );
}
