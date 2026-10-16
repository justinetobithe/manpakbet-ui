export type BannerPlacement = "hero" | "side" | "promo";

export type Banner = {
    id: number;
    title: string;
    subtitle?: string | null;
    image: string;
    link_url?: string | null;
    cta_label?: string | null;
    placement: BannerPlacement;
    sort_order: number;
    is_active: boolean;
};

export type Promotion = {
    id: number;
    title: string;
    slug: string;
    tag?: string | null;
    summary?: string | null;
    content?: string | null;
    image?: string | null;
    cta_label?: string | null;
    cta_url?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    sort_order: number;
    is_active: boolean;
};

export type PostCategory = "news" | "announcement" | "event" | "guide";

export type Post = {
    id: number;
    title: string;
    slug: string;
    category: PostCategory;
    excerpt?: string | null;
    content?: string | null;
    image?: string | null;
    is_pinned: boolean;
    is_published: boolean;
    published_at?: string | null;
};
