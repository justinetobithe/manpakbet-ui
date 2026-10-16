import { Suspense } from "react";
import type { Metadata } from "next";
import GamesExplorer from "@/components/games/GamesExplorer";
import GameGrid from "@/components/games/GameGrid";

export const metadata: Metadata = { title: "All Games" };

export default function GamesPage() {
    return (
        <Suspense fallback={<GameGrid loading />}>
            <GamesExplorer />
        </Suspense>
    );
}
