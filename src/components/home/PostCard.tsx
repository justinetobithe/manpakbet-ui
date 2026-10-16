"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pin } from "lucide-react";
import { AppBadge, AppImage } from "@/components/app";
import { timeAgo, titleCase } from "@/lib/format";
import type { Post } from "@/types/Content";

const tones = { news: "info", announcement: "ember", event: "gold", guide: "success" } as const;

export default function PostCard({ post, index = 0, horizontal = false }: { post: Post; index?: number; horizontal?: boolean }) {
    return (
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
            <Link
                href={`/news/${post.slug}`}
                className={
                    horizontal
                        ? "group flex gap-4 rounded-2xl border border-border bg-white/2.5 p-3 transition hover:border-gold-400/40"
                        : "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-plum-850 transition hover:-translate-y-1 hover:border-gold-400/40"
                }
            >
                <AppImage
                    src={post.image}
                    alt={post.title}
                    wrapperClassName={horizontal ? "size-24 shrink-0 rounded-xl" : "aspect-[16/9]"}
                    className="transition duration-700 group-hover:scale-105"
                />
                <div className={horizontal ? "min-w-0 flex-1 py-1" : "flex flex-1 flex-col gap-2 p-4 sm:p-5"}>
                    <div className="flex items-center gap-2">
                        <AppBadge tone={tones[post.category] ?? "neutral"} size="sm">
                            {titleCase(post.category)}
                        </AppBadge>
                        {post.is_pinned ? <Pin className="size-3.5 text-gold-300" /> : null}
                        <span className="text-[11px] text-muted-foreground">{timeAgo(post.published_at)}</span>
                    </div>
                    <h3 className={horizontal ? "mt-1.5 line-clamp-2 text-sm font-bold group-hover:text-gold-200" : "font-display text-base leading-snug font-extrabold group-hover:text-gold-200"}>{post.title}</h3>
                    {post.excerpt && !horizontal ? <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}
                </div>
            </Link>
        </motion.div>
    );
}
