import type { Metadata } from "next";
import PostDetail from "@/components/content/PostDetail";
import { titleCase } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return { title: titleCase(slug) };
}

export default async function NewsArticlePage({ params }: Props) {
    const { slug } = await params;
    return <PostDetail slug={slug} />;
}
