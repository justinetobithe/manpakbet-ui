"use client";

import * as React from "react";
import { Newspaper } from "lucide-react";
import { AppButton, AppEmpty, AppPageHeader } from "@/components/app";
import PostCard from "@/components/home/PostCard";
import { usePosts } from "@/lib/ContentAPI";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/types/Content";

const tabs: Array<{ value: PostCategory | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "announcement", label: "Announcements" },
    { value: "news", label: "News" },
    { value: "event", label: "Events" },
    { value: "guide", label: "Guides" },
];

export default function NewsView() {
    const [category, setCategory] = React.useState<PostCategory | "all">("all");
    const [page, setPage] = React.useState(1);
    const { data, isLoading, isFetching } = usePosts(category === "all" ? undefined : category, page, 12);
    const posts = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className="space-y-6">
            <AppPageHeader eyebrow="Stay in the loop" icon={<Newspaper />} title="News & Updates" description="Announcements, events and guides from the ManpakBet team." />

            <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => {
                            setCategory(tab.value);
                            setPage(1);
                        }}
                        className={cn(
                            "h-9 shrink-0 rounded-full border px-4 text-xs font-bold transition",
                            category === tab.value ? "bg-gold border-transparent text-[#2a1600]" : "border-border text-foreground/70 hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/5" />
                    ))}
                </div>
            ) : posts.length ? (
                <div className={cn("grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3", isFetching && "opacity-60")}>
                    {posts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <AppEmpty icon={<Newspaper />} title="Nothing posted yet" description="We'll share updates here as soon as they're ready." />
            )}

            {meta && meta.last_page > 1 ? (
                <div className="flex items-center justify-center gap-3">
                    <AppButton tone="surface" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                        Previous
                    </AppButton>
                    <span className="text-sm text-muted-foreground">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <AppButton tone="surface" size="sm" disabled={page >= meta.last_page} onClick={() => setPage((value) => value + 1)}>
                        Next
                    </AppButton>
                </div>
            ) : null}
        </div>
    );
}
