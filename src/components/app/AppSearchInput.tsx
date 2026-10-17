"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

type AppSearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    delay?: number;
    className?: string;
    autoFocus?: boolean;
};

export default function AppSearchInput({ value, onChange, placeholder = "Search…", delay = 350, className, autoFocus }: AppSearchInputProps) {
    const [draft, setDraft] = React.useState(value);
    const [prevValue, setPrevValue] = React.useState(value);
    const debounced = useDebouncedValue(draft, delay);
    const draftRef = React.useRef(draft);

    React.useEffect(() => {
        draftRef.current = draft;
    }, [draft]);
    const onChangeRef = React.useRef(onChange);
    const valueRef = React.useRef(value);

    if (value !== prevValue) {
        setPrevValue(value);
        setDraft(value);
    }

    React.useEffect(() => {
        onChangeRef.current = onChange;
        valueRef.current = value;
    }, [onChange, value]);

    React.useEffect(() => {
        if (debounced === draftRef.current && debounced !== valueRef.current) onChangeRef.current(debounced);
    }, [debounced]);

    return (
        <div className={cn("relative", className)}>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
                value={draft}
                autoFocus={autoFocus}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-xl border border-input bg-fg/4 pr-9 pl-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-gold-400/40 focus:bg-fg/6 focus:ring-2 focus:ring-gold-400/15"
            />
            {draft ? (
                <button
                    type="button"
                    onClick={() => {
                        setDraft("");
                        onChange("");
                    }}
                    className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-fg/10 hover:text-foreground"
                    aria-label="Clear search"
                >
                    <X className="size-3.5" />
                </button>
            ) : null}
        </div>
    );
}
