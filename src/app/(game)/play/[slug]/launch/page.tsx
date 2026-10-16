import { Suspense } from "react";
import type { Metadata } from "next";
import GameLauncher from "@/components/games/GameLauncher";
import { titleCase } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return { title: `Playing ${titleCase(slug)}`, robots: { index: false } };
}

export default async function GameLaunchPage({ params }: Props) {
    const { slug } = await params;

    return (
        <Suspense>
            <GameLauncher slug={slug} />
        </Suspense>
    );
}
