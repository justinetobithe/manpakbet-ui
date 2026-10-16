"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminResource, AdminRole, AdminStats, PermissionDefinition } from "@/types/Admin";
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

export const useAdminStats = () =>
    useQuery({
        queryKey: adminKeys.stats(),
        queryFn: async () => (await api.get<ApiEnvelope<AdminStats>>("/admin/stats")).data.data,
        refetchInterval: 60 * 1000,
    });

export const useAdminList = <T,>(resource: AdminResource | "transactions", params: ListParams, enabled = true) =>
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
