"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { usePosts } from "@/lib/ContentAPI";

export default function AnnouncementBar() {
    const { data } = usePosts(undefined, 1, 8);
    const posts = data?.data ?? [];

    if (!posts.length) return null;

    const items = [...posts, ...posts];

    return (
        <div className="border-b border-border bg-linear-to-r from-ember-600/15 via-plum-900/60 to-gold-500/10">
            <div className="mx-auto flex h-9 max-w-[1400px] items-center gap-3 px-3 sm:px-5">
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ember-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-ember-400 uppercase ring-1 ring-ember-500/30">
                    <Megaphone className="size-3" />
                    <span className="hidden sm:inline">Updates</span>
                </span>
                <div className="mask-fade-x relative min-w-0 flex-1 overflow-hidden">
                    <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]" style={{ ["--marquee-duration" as string]: `${Math.max(items.length * 5, 30)}s` }}>
                        {items.map((post, index) => (
                            <Link key={`${post.id}-${index}`} href={`/news/${post.slug}`} className="inline-flex items-center gap-2 text-xs whitespace-nowrap text-foreground/75 transition hover:text-gold-200">
                                <span className="size-1 rounded-full bg-gold-400" />
                                <span className="font-semibold text-foreground/90">{post.title}</span>
                                {post.excerpt ? <span className="hidden text-muted-foreground md:inline">— {post.excerpt}</span> : null}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
