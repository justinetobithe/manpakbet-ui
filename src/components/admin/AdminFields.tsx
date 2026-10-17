"use client";

import * as React from "react";
import { useController, type Control, type FieldValues } from "react-hook-form";
import { ImagePlus, Loader2, X } from "lucide-react";
import { AppFieldShell, AppImage, AppSelectField, AppSwitchField, AppTextareaField, AppTextField, AppToast, inputClass } from "@/components/app";
import { uploadImage } from "@/lib/AdminAPI";
import { cn } from "@/lib/utils";

export type FieldOption = { label: string; value: string };

export type AdminFieldConfig = {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "number" | "textarea" | "select" | "switch" | "image" | "datetime";
    placeholder?: string;
    hint?: string;
    options?: FieldOption[];
    optionsKey?: string;
    allowEmpty?: boolean;
    span?: 1 | 2;
    rows?: number;
    folder?: string;
    hidden?: (values: Record<string, unknown>, editing: boolean) => boolean;
};

type FormControl = Control<Record<string, unknown>>;

function ImageField({ control, field }: { control: FormControl; field: AdminFieldConfig }) {
    const { field: controller, fieldState } = useController({ control, name: field.name });
    const [uploading, setUploading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const value = (controller.value as string) ?? "";

    const onFile = async (file?: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const result = await uploadImage(file, field.folder ?? "misc");
            controller.onChange(result.path);
            AppToast.success("Image uploaded");
        } catch (err) {
            AppToast.apiError(err, "Upload failed");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <AppFieldShell label={field.label} hint={field.hint ?? "Upload an image or paste a URL/path"} error={fieldState.error?.message}>
            <div className="flex gap-3">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-fg/3">
                    {value ? <AppImage src={value} alt="" wrapperClassName="absolute inset-0" /> : <ImagePlus className="absolute inset-0 m-auto size-6 text-muted-foreground" />}
                    {uploading ? (
                        <div className="absolute inset-0 grid place-items-center bg-black/60">
                            <Loader2 className="size-5 animate-spin text-gold-300" />
                        </div>
                    ) : null}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="relative">
                        <input value={value} onChange={(event) => controller.onChange(event.target.value)} placeholder="/storage/uploads/…" className={cn(inputClass, "pr-9")} />
                        {value ? (
                            <button type="button" onClick={() => controller.onChange("")} className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-fg/10" aria-label="Clear image">
                                <X className="size-3.5" />
                            </button>
                        ) : null}
                    </div>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => onFile(event.target.files?.[0])} />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-fg/4 px-3 text-xs font-semibold transition hover:border-gold-400/40 disabled:opacity-50"
                    >
                        <ImagePlus className="size-3.5" /> Upload image
                    </button>
                </div>
            </div>
        </AppFieldShell>
    );
}

function DateTimeField({ control, field }: { control: FormControl; field: AdminFieldConfig }) {
    const { field: controller, fieldState } = useController({ control, name: field.name });
    return (
        <AppFieldShell label={field.label} hint={field.hint} error={fieldState.error?.message}>
            <input type="datetime-local" value={(controller.value as string) ?? ""} onChange={(event) => controller.onChange(event.target.value)} className={cn(inputClass, "[color-scheme:dark]")} />
        </AppFieldShell>
    );
}

export function AdminField<T extends FieldValues>({ control, field, options }: { control: Control<T>; field: AdminFieldConfig; options?: FieldOption[] }) {
    const c = control as unknown as FormControl;
    const name = field.name as never;

    switch (field.type) {
        case "textarea":
            return <AppTextareaField control={c} name={name} label={field.label} hint={field.hint} placeholder={field.placeholder} rows={field.rows ?? 5} />;
        case "select":
            return <AppSelectField control={c} name={name} label={field.label} hint={field.hint} options={options ?? field.options ?? []} allowEmpty={field.allowEmpty} placeholder={field.placeholder} />;
        case "switch":
            return <AppSwitchField control={c} name={name} label={field.label} hint={field.hint} />;
        case "image":
            return <ImageField control={c} field={field} />;
        case "datetime":
            return <DateTimeField control={c} field={field} />;
        default:
            return (
                <AppTextField
                    control={c}
                    name={name}
                    label={field.label}
                    hint={field.hint}
                    placeholder={field.placeholder}
                    type={field.type}
                    inputMode={field.type === "number" ? "numeric" : undefined}
                />
            );
    }
}

export const toDateTimeLocal = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const fromDateTimeLocal = (value?: unknown) => (typeof value === "string" && value ? new Date(value).toISOString() : null);
