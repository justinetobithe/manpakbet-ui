import { Suspense } from "react";
import type { Metadata } from "next";
import GamesExplorer from "@/components/games/GamesExplorer";
import GameGrid from "@/components/games/GameGrid";
import { titleCase } from "@/lib/format";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    return { title: `${titleCase(category)} Games` };
}

export default async function CategoryGamesPage({ params }: Props) {
    const { category } = await params;

    return (
        <Suspense fallback={<GameGrid loading />}>
            <GamesExplorer category={category} />
        </Suspense>
    );
}
