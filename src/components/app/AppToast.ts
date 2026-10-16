import { toast, type ExternalToast } from "sonner";
import apiError from "@/lib/apiError";

type ToastOptions = ExternalToast & { description?: string };

const AppToast = {
    success: (title: string, options?: ToastOptions) => toast.success(title, options),
    error: (title: string, options?: ToastOptions) => toast.error(title, options),
    info: (title: string, options?: ToastOptions) => toast.info(title, options),
    warning: (title: string, options?: ToastOptions) => toast.warning(title, options),
    message: (title: string, options?: ToastOptions) => toast(title, options),
    apiError: (err: unknown, title = "Request failed") => toast.error(title, { description: apiError(err) }),
    promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string | ((data: T) => string); error?: string }) =>
        toast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: (err: unknown) => messages.error ?? apiError(err),
        }),
    dismiss: (id?: string | number) => toast.dismiss(id),
};

export default AppToast;
