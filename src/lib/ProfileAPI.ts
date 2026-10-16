"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/Api";
import type { PasswordInput, ProfileInput, User } from "@/types/User";

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
