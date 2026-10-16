import type { Metadata } from "next";
import PromotionDetail from "@/components/content/PromotionDetail";
import { titleCase } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return { title: titleCase(slug) };
}

export default async function PromotionPage({ params }: Props) {
    const { slug } = await params;
    return <PromotionDetail slug={slug} />;
}
