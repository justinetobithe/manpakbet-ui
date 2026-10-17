"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminResource, AdminRole, AdminStats, AppSettings, PermissionDefinition, SystemInfo } from "@/types/Admin";
import type { KycFileType, KycSubmission } from "@/types/Kyc";
import type { ApiEnvelope, ApiPaginated, ListParams } from "@/types/Api";
import type { User } from "@/types/User";
import type { Transaction } from "@/types/Wallet";

export const adminKeys = {
    all: ["admin"] as const,
    stats: () => ["admin", "stats"] as const,
    list: (resource: string, params: ListParams) => ["admin", resource, "list", params] as const,
    resource: (resource: string) => ["admin", resource] as const,
    roles: () => ["admin", "roles"] as const,
};

const cleanParams = (params: ListParams) =>
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));

export const getAdminList = async <T,>(resource: string, params: ListParams) => {
    const { data } = await api.get<ApiPaginated<T>>(`/admin/${resource}`, { params: cleanParams(params) });
    return data;
};

export const saveAdminRecord = async <T,>(resource: string, payload: Record<string, unknown>, id?: number | null) => {
    const { data } = id
        ? await api.put<ApiEnvelope<T>>(`/admin/${resource}/${id}`, payload)
        : await api.post<ApiEnvelope<T>>(`/admin/${resource}`, payload);
    return data;
};

export const deleteAdminRecord = async (resource: string, id: number) => {
    const { data } = await api.delete<ApiEnvelope<null>>(`/admin/${resource}/${id}`);
    return data;
};

export const useAdminStats = (enabled = true) =>
    useQuery({
        queryKey: adminKeys.stats(),
        queryFn: async () => (await api.get<ApiEnvelope<AdminStats>>("/admin/stats")).data.data,
        refetchInterval: 60 * 1000,
        enabled,
    });

export const useAdminList = <T,>(resource: AdminResource, params: ListParams, enabled = true) =>
    useQuery({
        queryKey: adminKeys.list(resource, params),
        queryFn: () => getAdminList<T>(resource, params),
        placeholderData: keepPreviousData,
        enabled,
    });

export const useAdminOptions = <T,>(resource: AdminResource, enabled = true) =>
    useQuery({
        queryKey: adminKeys.list(resource, { per_page: 100, options: 1 }),
        queryFn: () => getAdminList<T>(resource, { per_page: 100 }),
        staleTime: 5 * 60 * 1000,
        select: (response) => response.data,
        enabled,
    });

export const useSaveAdminRecord = <T,>(resource: AdminResource) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ payload, id }: { payload: Record<string, unknown>; id?: number | null }) => saveAdminRecord<T>(resource, payload, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.resource(resource) });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            queryClient.invalidateQueries({ queryKey: ["casino"] });
            queryClient.invalidateQueries({ queryKey: ["content"] });
        },
    });
};

export const useDeleteAdminRecord = (resource: AdminResource) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAdminRecord(resource, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.resource(resource) });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            queryClient.invalidateQueries({ queryKey: ["casino"] });
            queryClient.invalidateQueries({ queryKey: ["content"] });
        },
    });
};

export const useProcessTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, action, notes }: { id: number; action: "approve" | "reject"; notes?: string }) =>
            (await api.post<ApiEnvelope<Transaction>>(`/admin/transactions/${id}/${action}`, notes ? { notes } : {})).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.resource("transactions") });
            queryClient.invalidateQueries({ queryKey: adminKeys.resource("users") });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
        },
    });
};

export const useAdjustBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, amount, notes }: { id: number; amount: number; notes?: string }) =>
            (await api.post<ApiEnvelope<User>>(`/admin/users/${id}/balance`, { amount, notes })).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.resource("users") });
            queryClient.invalidateQueries({ queryKey: adminKeys.resource("transactions") });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
        },
    });
};

export const useRoles = (enabled = true) =>
    useQuery({
        queryKey: adminKeys.roles(),
        queryFn: async () => (await api.get<ApiEnvelope<{ roles: AdminRole[]; permissions: PermissionDefinition[] }>>("/admin/roles")).data.data,
        enabled,
    });

export const useSaveRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, name, permissions }: { id?: number; name?: string; permissions: string[] }) =>
            id
                ? (await api.put<ApiEnvelope<AdminRole>>(`/admin/roles/${id}`, { permissions })).data
                : (await api.post<ApiEnvelope<AdminRole>>("/admin/roles", { name, permissions })).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.roles() }),
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => (await api.delete<ApiEnvelope<null>>(`/admin/roles/${id}`)).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.roles() }),
    });
};

export const uploadImage = async (file: File, folder: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const { data } = await api.post<ApiEnvelope<{ path: string; url: string }>>("/admin/uploads", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
};

export const useAdminDetail = <T,>(resource: AdminResource, id: number | null | undefined) =>
    useQuery({
        queryKey: [...adminKeys.resource(resource), "detail", id],
        queryFn: async () => (await api.get<ApiEnvelope<T>>(`/admin/${resource}/${id}`)).data.data,
        enabled: Boolean(id),
    });

export const useAdminSettings = () =>
    useQuery({
        queryKey: ["admin", "settings"],
        queryFn: async () => (await api.get<ApiEnvelope<{ settings: AppSettings; system: SystemInfo }>>("/admin/settings")).data.data,
    });

export const useSaveSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Partial<{ [K in keyof AppSettings]: Partial<AppSettings[K]> }>) =>
            (await api.put<ApiEnvelope<{ settings: AppSettings; system: SystemInfo }>>("/admin/settings", payload)).data,
        onSuccess: (response) => {
            queryClient.setQueryData(["admin", "settings"], response.data);
            queryClient.invalidateQueries({ queryKey: ["content", "settings"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });
};

export const useReviewKyc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, decision, reason }: { id: number; decision: "approve" | "reject"; reason?: string }) =>
            (await api.post<ApiEnvelope<KycSubmission>>(`/admin/kyc/${id}/review`, { decision, reason })).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.resource("kyc") });
            queryClient.invalidateQueries({ queryKey: adminKeys.resource("users") });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
        },
    });
};

export const useKycFile = (id: number | null | undefined, type: KycFileType, enabled = true) =>
    useQuery({
        queryKey: ["admin", "kyc", "file", id, type],
        queryFn: async () => {
            const { data } = await api.get<Blob>(`/admin/kyc/${id}/files/${type}`, { responseType: "blob" });
            return URL.createObjectURL(data);
        },
        enabled: Boolean(id) && enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
