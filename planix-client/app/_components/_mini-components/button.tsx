"use client";

import { cn } from "@/lib/utils";

export default function Button(props: {
    children: React.ReactNode,
    fct?: () => void | Promise<void>
    disabled?: boolean
    type?: "button" | "submit"
    className?: string
}) {

    return (
        <button type={props.type ?? "button"} className={cn("bg-blue-600 hover:bg-blue-700 p-2 px-4 text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", props.className)}
            onClick={props.fct ?? undefined}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );

}
