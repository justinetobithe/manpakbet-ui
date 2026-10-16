"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope, ApiPaginated } from "@/types/Api";
import type { Transaction, TransactionStatus, TransactionType, WalletRequest, WalletSummary } from "@/types/Wallet";

export type TransactionFilters = {
    page?: number;
    per_page?: number;
    type?: TransactionType | "";
    status?: TransactionStatus | "";
};

export const walletKeys = {
    all: ["wallet"] as const,
    summary: () => ["wallet", "summary"] as const,
    transactions: (filters: TransactionFilters) => ["wallet", "transactions", filters] as const,
};

export const getWallet = async () => {
    const { data } = await api.get<ApiEnvelope<WalletSummary>>("/wallet");
    return data.data;
};

export const getTransactions = async (filters: TransactionFilters) => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined));
    const { data } = await api.get<ApiPaginated<Transaction>>("/wallet/transactions", { params });
    return data;
};

export const deposit = async (input: WalletRequest) => {
    const { data } = await api.post<ApiEnvelope<Transaction>>("/wallet/deposit", input);
    return data;
};

export const withdraw = async (input: WalletRequest) => {
    const { data } = await api.post<ApiEnvelope<Transaction>>("/wallet/withdraw", input);
    return data;
};

export const useWallet = (enabled = true) =>
    useQuery({
        queryKey: walletKeys.summary(),
        queryFn: getWallet,
        enabled,
        refetchInterval: enabled ? 30 * 1000 : false,
        refetchOnWindowFocus: true,
    });

export const useTransactions = (filters: TransactionFilters, enabled = true) =>
    useQuery({
        queryKey: walletKeys.transactions(filters),
        queryFn: () => getTransactions(filters),
        enabled,
        placeholderData: keepPreviousData,
    });

const useWalletMutation = (fn: (input: WalletRequest) => Promise<ApiEnvelope<Transaction>>) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: walletKeys.all }),
    });
};

export const useDeposit = () => useWalletMutation(deposit);

export const useWithdraw = () => useWalletMutation(withdraw);
