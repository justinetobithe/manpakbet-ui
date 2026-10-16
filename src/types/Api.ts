export type ApiStatus = "success" | "error";

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type ApiEnvelope<T> = {
    status: ApiStatus;
    message: string;
    data: T;
};

export type ApiPaginated<T> = ApiEnvelope<T[]> & {
    meta: PaginationMeta;
};

export type ListParams = {
    page?: number;
    per_page?: number;
    search?: string;
    sort?: string;
    direction?: "asc" | "desc";
    [key: string]: string | number | boolean | undefined | null;
};
