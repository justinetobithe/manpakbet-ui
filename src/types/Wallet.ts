import type { KycStatus } from "./User";

export type TransactionType = "deposit" | "withdraw" | "bonus" | "adjustment";

export type TransactionStatus = "pending" | "approved" | "rejected";

export type PaymentMethod = "gcash" | "maya";

export type Transaction = {
    id: number;
    user_id: number;
    reference: string;
    type: TransactionType;
    method?: PaymentMethod | "manual" | null;
    amount: string;
    status: TransactionStatus;
    account_name?: string | null;
    account_number?: string | null;
    notes?: string | null;
    processed_at?: string | null;
    created_at: string;
    user?: {
        id: number;
        first_name?: string | null;
        last_name?: string | null;
        email?: string | null;
        phone?: string | null;
    } | null;
    processor?: {
        id: number;
        first_name?: string | null;
        last_name?: string | null;
        email?: string | null;
    } | null;
};

export type WalletSummary = {
    balance: number;
    pending_withdrawals: number;
    pending_deposits: number;
    total_deposits: number;
    total_withdrawals: number;
    limits: {
        min_deposit: number;
        max_deposit: number;
        min_withdraw: number;
        max_withdraw: number;
        methods: PaymentMethod[];
    };
    channels: Array<{ id: PaymentMethod; account_name?: string | null; account_number?: string | null }>;
    kyc_status: KycStatus;
    require_kyc_for_withdraw: boolean;
};

export type HistorySummary = {
    cash_in: number;
    cash_out: number;
    total_bets: number;
    total_wins: number;
    rounds: number;
    net_gaming: number;
    balance: number;
};

export type WalletRequest = {
    amount: number;
    method: PaymentMethod;
    account_name?: string;
    account_number?: string;
};
