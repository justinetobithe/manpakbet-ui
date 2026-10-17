"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/Api";
import type { KycOverview, KycSubmission } from "@/types/Kyc";
import type { PasswordInput, ProfileInput, User } from "@/types/User";
import type { HistorySummary } from "@/types/Wallet";

export const profileKeys = {
    me: () => ["profile", "me"] as const,
};

export const getMe = async () => {
    const { data } = await api.get<ApiEnvelope<User>>("/me");
    return data.data;
};

export const updateProfile = async (input: ProfileInput) => {
    const { data } = await api.put<ApiEnvelope<User>>("/me", input);
    return data;
};

export const updatePassword = async (input: PasswordInput) => {
    const { data } = await api.put<ApiEnvelope<null>>("/me/password", input);
    return data;
};

export const useMe = (enabled = true) => useQuery({ queryKey: profileKeys.me(), queryFn: getMe, enabled });

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (response) => queryClient.setQueryData(profileKeys.me(), response.data),
    });
};

export const useUpdatePassword = () => useMutation({ mutationFn: updatePassword });

export const useKyc = (enabled = true) =>
    useQuery({
        queryKey: ["profile", "kyc"],
        queryFn: async () => (await api.get<ApiEnvelope<KycOverview>>("/me/kyc")).data.data,
        enabled,
    });

export const useSubmitKyc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (form: FormData) =>
            (await api.post<ApiEnvelope<{ status: string; submission: KycSubmission }>>("/me/kyc", form, { headers: { "Content-Type": "multipart/form-data" } })).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", "kyc"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });
};

export const useHistorySummary = (enabled = true) =>
    useQuery({
        queryKey: ["profile", "history"],
        queryFn: async () => (await api.get<ApiEnvelope<HistorySummary>>("/me/history")).data.data,
        enabled,
    });
