import type { Metadata } from "next";
import GameDetail from "@/components/games/GameDetail";
import { titleCase } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return { title: titleCase(slug) };
}

export default async function PlayPage({ params }: Props) {
    const { slug } = await params;
    return <GameDetail slug={slug} />;
}
