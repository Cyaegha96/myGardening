"use client";

import {
    Label as AriaLabel,
    Text,
    FieldError as AriaFieldError,
} from "react-aria-components";

import { cn } from "@/shared/shadcn/lib/utils";

export function Label({ className, ...props }: any) {
    return (
        <AriaLabel
            {...props}
            className={cn(
                "text-sm font-medium leading-none",
                "data-[disabled]:opacity-50 data-[invalid]:text-destructive",
                className
            )}
        />
    );
}

export function FieldGroup({ className, ...props }: any) {
    return (
        <div
            {...props}
            className={cn(
                "flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm",
                "data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2",
                className
            )}
        />
    );
}

export function FieldError({ className, ...props }: any) {
    return (
        <AriaFieldError
            {...props}
            className={cn("text-sm text-destructive font-medium", className)}
        />
    );
}

export function FormDescription({ className, ...props }: any) {
    return (
        <Text
            {...props}
            slot="description"
            className={cn("text-sm text-muted-foreground", className)}
        />
    );
}
