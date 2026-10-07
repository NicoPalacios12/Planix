"use client";

import { cn } from "@/lib/utils";

const variants = {
    primary: "bg-brand-navy text-white hover:bg-brand-navy/90",
    accent: "bg-brand-cyan text-brand-navy hover:brightness-110",
    ghost: "border border-white/25 text-white hover:bg-white/10",
}

export default function Button(props: {
    children: React.ReactNode,
    fct?: () => void | Promise<void>
    disabled?: boolean
    type?: "button" | "submit"
    variant?: keyof typeof variants
    className?: string
}) {

    return (
        <button
            type={props.type ?? "button"}
            className={cn(
                "rounded-md p-2 px-4 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                variants[props.variant ?? "primary"],
                props.className
            )}
            onClick={props.fct ?? undefined}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );

}