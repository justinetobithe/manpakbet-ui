"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppButton, AppConfirm, AppDialog, AppPageHeader, AppSearchInput, AppTable, AppToast, type AppTableSort } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useAdminList, useDeleteAdminRecord, useSaveAdminRecord } from "@/lib/AdminAPI";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores";
import type { AdminResource } from "@/types/Admin";
import type { ListParams } from "@/types/Api";
import type { Permission } from "@/types/User";
import { AdminField, type AdminFieldConfig, type FieldOption } from "./AdminFields";

type FormValues = Record<string, unknown>;

export type ResourceFilter = { key: string; label: string; options: FieldOption[] };

export type ResourceConfig<T extends { id: number }> = {
    resource: AdminResource;
    title: string;
    singular: string;
    description?: string;
    icon?: React.ReactNode;
    permission?: Permission;
    columns: ColumnDef<T, unknown>[];
    fields: AdminFieldConfig[];
    schema: z.ZodType<FormValues, FormValues>;
    defaults: FormValues;
    toForm: (record: T) => FormValues;
    toPayload?: (values: FormValues, editing: boolean) => Record<string, unknown>;
    filters?: ResourceFilter[];
    searchPlaceholder?: string;
    defaultSort?: AppTableSort;
    dialogSize?: "md" | "lg" | "xl";
    optionSources?: Record<string, FieldOption[]>;
    rowActions?: (record: T) => React.ReactNode;
    rowHref?: (record: T) => string;
    renderMobileCard?: (record: T) => React.ReactNode;
    canDelete?: (record: T) => boolean;
};

export default function ResourceManager<T extends { id: number }>({ config }: { config: ResourceConfig<T> }) {
    const router = useRouter();
    const { can } = useAuth();
    const pageSize = useAdminStore((state) => state.pageSize);
    const setPageSize = useAdminStore((state) => state.setPageSize);
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("");
    const [sort, setSort] = React.useState<AppTableSort>(config.defaultSort ?? null);
    const [filters, setFilters] = React.useState<Record<string, string>>({});
    const [editing, setEditing] = React.useState<T | null>(null);
    const [formOpen, setFormOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState<T | null>(null);

    const params: ListParams = {
        page,
        per_page: pageSize,
        search: search || undefined,
        sort: sort?.id,
        direction: sort ? (sort.desc ? "desc" : "asc") : undefined,
        ...filters,
    };

    const list = useAdminList<T>(config.resource, params);
    const save = useSaveAdminRecord<T>(config.resource);
    const remove = useDeleteAdminRecord(config.resource);
    const writable = config.permission ? can(config.permission) : true;

    const form = useForm<FormValues>({ resolver: zodResolver(config.schema), defaultValues: config.defaults });
    const values = useWatch({ control: form.control }) as FormValues;

    const openCreate = () => {
        setEditing(null);
        form.reset(config.defaults);
        setFormOpen(true);
    };

    const openEdit = React.useCallback(
        (record: T) => {
            setEditing(record);
            form.reset({ ...config.defaults, ...config.toForm(record) });
            setFormOpen(true);
        },
        [config, form]
    );

    const submit = form.handleSubmit(async (formValues) => {
        const payload = config.toPayload ? config.toPayload(formValues, Boolean(editing)) : formValues;
        try {
            const response = await save.mutateAsync({ payload, id: editing?.id });
            AppToast.success(response.message);
            setFormOpen(false);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => form.setError(key, { message }));
            AppToast.error(`Could not save ${config.singular.toLowerCase()}`, { description: apiError(err) });
        }
    });

    const confirmDelete = async () => {
        if (!deleting) return;
        try {
            const response = await remove.mutateAsync(deleting.id);
            AppToast.success(response.message);
            setDeleting(null);
        } catch (err) {
            AppToast.apiError(err, "Delete failed");
        }
    };

    const columns = React.useMemo<ColumnDef<T, unknown>[]>(
        () => [
            ...config.columns,
            {
                id: "actions",
                header: "",
                enableSorting: false,
                meta: { align: "right" },
                cell: ({ row }) => (
                    <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                        {config.rowActions?.(row.original)}
                        {writable ? (
                            <>
                                <AppButton tone="ghost" size="icon-sm" onClick={() => openEdit(row.original)} aria-label="Edit">
                                    <Pencil />
                                </AppButton>
                                {config.canDelete?.(row.original) !== false ? (
                                    <AppButton tone="ghost" size="icon-sm" className="text-red-300 hover:bg-destructive/15" onClick={() => setDeleting(row.original)} aria-label="Delete">
                                        <Trash2 />
                                    </AppButton>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                ),
            },
        ],
        [config, writable, openEdit]
    );

    const visibleFields = config.fields.filter((field) => !field.hidden?.(values, Boolean(editing)));

    return (
        <div className="space-y-5">
            <AppPageHeader
                icon={config.icon}
                title={config.title}
                description={config.description}
                actions={
                    writable ? (
                        <AppButton leftIcon={<Plus />} onClick={openCreate}>
                            New {config.singular.toLowerCase()}
                        </AppButton>
                    ) : null
                }
            />

            <AppTable
                columns={columns}
                data={list.data?.data}
                meta={list.data?.meta}
                isLoading={list.isLoading}
                isFetching={list.isFetching}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
                sort={sort}
                onSortChange={(next) => {
                    setSort(next);
                    setPage(1);
                }}
                onRowClick={config.rowHref ? (record) => router.push(config.rowHref!(record)) : writable ? openEdit : undefined}
                renderMobileCard={config.renderMobileCard}
                emptyTitle={`No ${config.title.toLowerCase()} found`}
                toolbar={
                    <>
                        <AppSearchInput
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                                setPage(1);
                            }}
                            placeholder={config.searchPlaceholder ?? `Search ${config.title.toLowerCase()}…`}
                            className="w-full sm:max-w-xs sm:flex-1"
                        />
                        {config.filters?.length ? (
                            <div className="grid grid-cols-2 gap-2 sm:flex">
                                {config.filters.map((filter) => (
                                    <Select
                                        key={filter.key}
                                        value={filters[filter.key] ?? "all"}
                                        onValueChange={(value) => {
                                            setFilters((current) => {
                                                const next = { ...current };
                                                if (value === "all") delete next[filter.key];
                                                else next[filter.key] = value;
                                                return next;
                                            });
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="sm:w-40">
                                            <SelectValue placeholder={filter.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>
                                            {filter.options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ))}
                            </div>
                        ) : null}
                    </>
                }
            />

            <AppDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                size={config.dialogSize ?? "lg"}
                title={editing ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}
                description={editing ? `Update the details below and save your changes.` : `Fill in the details to create a ${config.singular.toLowerCase()}.`}
                footer={
                    <>
                        <AppButton tone="ghost" onClick={() => setFormOpen(false)} disabled={save.isPending}>
                            Cancel
                        </AppButton>
                        <AppButton onClick={submit} loading={save.isPending}>
                            {editing ? "Save changes" : `Create ${config.singular.toLowerCase()}`}
                        </AppButton>
                    </>
                }
            >
                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
                    {visibleFields.map((field) => (
                        <div key={field.name} className={cn(field.span === 2 || field.type === "textarea" || field.type === "image" ? "sm:col-span-2" : undefined)}>
                            <AdminField control={form.control} field={field} options={field.optionsKey ? config.optionSources?.[field.optionsKey] : undefined} />
                        </div>
                    ))}
                    <button type="submit" className="hidden" />
                </form>
            </AppDialog>

            <AppConfirm
                open={Boolean(deleting)}
                onOpenChange={(open) => (!open ? setDeleting(null) : undefined)}
                title={`Delete ${config.singular.toLowerCase()}?`}
                description="This action cannot be undone."
                confirmLabel="Delete"
                loading={remove.isPending}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
