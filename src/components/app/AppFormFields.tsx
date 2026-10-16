"use client";

import * as React from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const inputClass =
    "h-11 w-full rounded-xl border border-input bg-white/4 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-gold-400/45 focus:bg-white/6 focus:ring-2 focus:ring-gold-400/15 disabled:opacity-50 aria-[invalid=true]:border-destructive/70";

type FieldShellProps = {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: string;
    className?: string;
    htmlFor?: string;
    children: React.ReactNode;
};

export function AppFieldShell({ label, hint, error, className, htmlFor, children }: FieldShellProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label ? (
                <label htmlFor={htmlFor} className="block text-xs font-semibold text-foreground/80">
                    {label}
                </label>
            ) : null}
            {children}
            {error ? <p className="text-xs font-medium text-red-300">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
    );
}

type AnyControl<T extends FieldValues> = Control<T, unknown, FieldValues>;

type BaseProps<T extends FieldValues> = {
    control: AnyControl<T> | Control<T>;
    name: FieldPath<T>;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    className?: string;
    disabled?: boolean;
};

type TextFieldProps<T extends FieldValues> = BaseProps<T> & {
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    prefix?: React.ReactNode;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: string;
};

export function AppTextField<T extends FieldValues>({ control, name, label, hint, className, disabled, type = "text", placeholder, prefix, inputMode, autoComplete }: TextFieldProps<T>) {
    const [reveal, setReveal] = React.useState(false);
    const isPassword = type === "password";

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <AppFieldShell label={label} hint={hint} error={fieldState.error?.message} className={className} htmlFor={name}>
                    <div className="relative flex items-center">
                        {prefix ? <span className="pointer-events-none absolute left-3.5 text-sm font-semibold text-muted-foreground">{prefix}</span> : null}
                        <input
                            id={name}
                            {...field}
                            value={field.value ?? ""}
                            type={isPassword && reveal ? "text" : type}
                            placeholder={placeholder}
                            inputMode={inputMode}
                            autoComplete={autoComplete}
                            disabled={disabled}
                            aria-invalid={Boolean(fieldState.error)}
                            className={cn(inputClass, prefix ? "pl-11" : undefined, isPassword ? "pr-11" : undefined)}
                        />
                        {isPassword ? (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setReveal((value) => !value)}
                                className="absolute right-2 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                aria-label={reveal ? "Hide password" : "Show password"}
                            >
                                {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        ) : null}
                    </div>
                </AppFieldShell>
            )}
        />
    );
}

export function AppTextareaField<T extends FieldValues>({ control, name, label, hint, className, disabled, placeholder, rows = 4 }: BaseProps<T> & { placeholder?: string; rows?: number }) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <AppFieldShell label={label} hint={hint} error={fieldState.error?.message} className={className} htmlFor={name}>
                    <textarea
                        id={name}
                        {...field}
                        value={field.value ?? ""}
                        rows={rows}
                        placeholder={placeholder}
                        disabled={disabled}
                        aria-invalid={Boolean(fieldState.error)}
                        className={cn(inputClass, "h-auto min-h-24 py-3 leading-relaxed")}
                    />
                </AppFieldShell>
            )}
        />
    );
}

export type SelectOption = { label: string; value: string };

export function AppSelectField<T extends FieldValues>({
    control,
    name,
    label,
    hint,
    className,
    disabled,
    options,
    placeholder = "Select…",
    allowEmpty,
}: BaseProps<T> & { options: SelectOption[]; placeholder?: string; allowEmpty?: boolean }) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <AppFieldShell label={label} hint={hint} error={fieldState.error?.message} className={className}>
                    <Select
                        value={field.value === null || field.value === undefined || field.value === "" ? (allowEmpty ? "__none" : "") : String(field.value)}
                        onValueChange={(value) => field.onChange(value === "__none" ? "" : value)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-11" aria-invalid={Boolean(fieldState.error)}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {allowEmpty ? <SelectItem value="__none">None</SelectItem> : null}
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </AppFieldShell>
            )}
        />
    );
}

export function AppSwitchField<T extends FieldValues>({ control, name, label, hint, className, disabled }: BaseProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <label className={cn("flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-input bg-white/3 px-3.5 py-3", className)}>
                    <span>
                        <span className="block text-sm font-semibold">{label}</span>
                        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
                    </span>
                    <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} disabled={disabled} />
                </label>
            )}
        />
    );
}
