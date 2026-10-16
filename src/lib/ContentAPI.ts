"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope, ApiPaginated } from "@/types/Api";
import type { Banner, BannerPlacement, Post, PostCategory, Promotion } from "@/types/Content";

export const contentKeys = {
    banners: (placement?: BannerPlacement) => ["content", "banners", placement ?? "all"] as const,
    promotions: (tag?: string) => ["content", "promotions", tag ?? "all"] as const,
    promotion: (slug: string) => ["content", "promotion", slug] as const,
    posts: (category?: PostCategory, page = 1, perPage = 12) => ["content", "posts", category ?? "all", page, perPage] as const,
    post: (slug: string) => ["content", "post", slug] as const,
};

export const getBanners = async (placement?: BannerPlacement) => {
    const { data } = await api.get<ApiEnvelope<Banner[]>>("/content/banners", { params: placement ? { placement } : undefined });
    return data.data;
};

export const getPromotions = async (tag?: string) => {
    const { data } = await api.get<ApiEnvelope<Promotion[]>>("/content/promotions", { params: tag ? { tag } : undefined });
    return data.data;
};

export const getPromotion = async (slug: string) => {
    const { data } = await api.get<ApiEnvelope<Promotion>>(`/content/promotions/${encodeURIComponent(slug)}`);
    return data.data;
};

export const getPosts = async (category?: PostCategory, page = 1, perPage = 12) => {
    const { data } = await api.get<ApiPaginated<Post>>("/content/posts", { params: { category, page, per_page: perPage } });
    return data;
};

export const getPost = async (slug: string) => {
    const { data } = await api.get<ApiEnvelope<Post>>(`/content/posts/${encodeURIComponent(slug)}`);
    return data.data;
};

export const useBanners = (placement?: BannerPlacement) =>
    useQuery({ queryKey: contentKeys.banners(placement), queryFn: () => getBanners(placement), staleTime: 5 * 60 * 1000 });

export const usePromotions = (tag?: string) =>
    useQuery({ queryKey: contentKeys.promotions(tag), queryFn: () => getPromotions(tag), staleTime: 5 * 60 * 1000 });

export const usePromotion = (slug: string) =>
    useQuery({ queryKey: contentKeys.promotion(slug), queryFn: () => getPromotion(slug), enabled: Boolean(slug) });

export const usePosts = (category?: PostCategory, page = 1, perPage = 12) =>
    useQuery({
        queryKey: contentKeys.posts(category, page, perPage),
        queryFn: () => getPosts(category, page, perPage),
        placeholderData: keepPreviousData,
        staleTime: 2 * 60 * 1000,
    });

export const usePost = (slug: string) =>
    useQuery({ queryKey: contentKeys.post(slug), queryFn: () => getPost(slug), enabled: Boolean(slug) });
