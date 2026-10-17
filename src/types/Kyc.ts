import type { KycStatus } from "./User";

export type KycFileType = "id_front" | "id_back" | "selfie";

export type KycSubmission = {
    id: number;
    user_id: number;
    status: "pending" | "approved" | "rejected";
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    birthdate: string;
    nationality: string;
    occupation?: string | null;
    source_of_funds?: string | null;
    address: string;
    city: string;
    province: string;
    zip_code?: string | null;
    id_type: string;
    id_type_label: string;
    id_number?: string;
    masked_id_number: string;
    files: KycFileType[];
    rejection_reason?: string | null;
    reviewed_at?: string | null;
    created_at: string;
    user?: { id: number; first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null; kyc_status?: KycStatus } | null;
    reviewer?: { id: number; first_name?: string | null; last_name?: string | null; email?: string | null } | null;
};

export type KycOverview = {
    status: KycStatus;
    submission: KycSubmission | null;
    id_types: Array<{ value: string; label: string }>;
};
