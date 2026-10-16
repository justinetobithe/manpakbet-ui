import type { ApiStatus } from "./Api";

export default interface ErrorMessage {
    status?: ApiStatus;
    message?: string;
    data?: unknown;
    errors?: Record<string, string[] | string>;
}
