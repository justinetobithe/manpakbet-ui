"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope, ApiPaginated } from "@/types/Api";
import type { DepositRequest, PayoutAccount, PayoutAccountInput, Transaction, TransactionStatus, TransactionDetail, TransactionType, WalletSummary, WithdrawRequest } from "@/types/Wallet";

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
    payoutAccounts: () => ["wallet", "payout-accounts"] as const,
    transaction: (reference: string) => ["wallet", "transaction", reference] as const,
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

export const deposit = async (input: DepositRequest) => {
    const { data } = await api.post<ApiEnvelope<Transaction>>("/wallet/deposit", input);
    return data;
};

export const withdraw = async (input: WithdrawRequest) => {
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

const useWalletMutation = <T,>(fn: (input: T) => Promise<ApiEnvelope<Transaction>>) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: walletKeys.all }),
    });
};

export const useDeposit = () => useWalletMutation(deposit);

export const useWithdraw = () => useWalletMutation(withdraw);

export const getPayoutAccounts = async () => {
    const { data } = await api.get<ApiEnvelope<PayoutAccount[]>>("/me/payout-accounts");
    return data.data;
};

export const usePayoutAccounts = (enabled = true) =>
    useQuery({
        queryKey: walletKeys.payoutAccounts(),
        queryFn: getPayoutAccounts,
        enabled,
    });

const usePayoutMutation = <T,>(fn: (input: T) => Promise<ApiEnvelope<PayoutAccount | null>>) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: walletKeys.payoutAccounts() }),
    });
};

export const useAddPayoutAccount = () =>
    usePayoutMutation(async (input: PayoutAccountInput) => {
        const { data } = await api.post<ApiEnvelope<PayoutAccount>>("/me/payout-accounts", input);
        return data;
    });

export const useUpdatePayoutAccount = () =>
    usePayoutMutation(async ({ id, ...input }: { id: number; account_name?: string; is_default?: boolean }) => {
        const { data } = await api.put<ApiEnvelope<PayoutAccount>>(`/me/payout-accounts/${id}`, input);
        return data;
    });

export const useDeletePayoutAccount = () =>
    usePayoutMutation(async (id: number) => {
        const { data } = await api.delete<ApiEnvelope<null>>(`/me/payout-accounts/${id}`);
        return data;
    });

export const getTransaction = async (reference: string) => {
    const { data } = await api.get<ApiEnvelope<TransactionDetail>>(`/wallet/transactions/${reference}`);
    return data.data;
};

export const useTransaction = (reference: string) =>
    useQuery({
        queryKey: walletKeys.transaction(reference),
        queryFn: () => getTransaction(reference),
        enabled: Boolean(reference),
        refetchInterval: (query) => (query.state.data?.transaction.status === "pending" ? 15 * 1000 : false),
        refetchOnWindowFocus: true,
    });
