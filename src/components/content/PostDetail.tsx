"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft } from "lucide-react";
import { AppBadge, AppButton, AppEmpty, AppImage } from "@/components/app";
import PostCard from "@/components/home/PostCard";
import { usePost, usePosts } from "@/lib/ContentAPI";
import { formatDate, titleCase } from "@/lib/format";

export default function PostDetail({ slug }: { slug: string }) {
    const { data: post, isLoading, isError } = usePost(slug);
    const { data: latest } = usePosts(undefined, 1, 6);

    if (isLoading) return <div className="h-[480px] animate-pulse rounded-3xl bg-white/5" />;

    if (isError || !post) {
        return (
            <AppEmpty
                title="Article not found"
                action={
                    <AppButton asChild tone="surface">
                        <Link href="/news">Back to news</Link>
                    </AppButton>
                }
            />
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Link href="/news" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="size-4" /> News
                </Link>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <AppBadge tone="gold">{titleCase(post.category)}</AppBadge>
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5" />
                            {formatDate(post.published_at)}
                        </span>
                    </div>
                    <h1 className="font-display text-3xl font-extrabold text-balance sm:text-4xl">{post.title}</h1>
                    {post.excerpt ? <p className="text-lg text-foreground/75">{post.excerpt}</p> : null}
                </div>
                <AppImage src={post.image} alt={post.title} wrapperClassName="aspect-[16/8] rounded-3xl border border-border" />
                {post.content ? <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} /> : null}
            </motion.article>
            <aside className="space-y-3">
                <h2 className="font-display text-sm font-bold tracking-wider text-muted-foreground uppercase">Latest</h2>
                {latest?.data
                    .filter((item) => item.slug !== slug)
                    .slice(0, 5)
                    .map((item, index) => (
                        <PostCard key={item.id} post={item} index={index} horizontal />
                    ))}
            </aside>
        </div>
    );
}
