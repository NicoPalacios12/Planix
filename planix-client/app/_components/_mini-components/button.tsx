"use client";

export default function Button(props: {
    children: React.ReactNode,
    fct?: () => void | Promise<void>
    disabled?: boolean
}) {

    return (
        <button type="button" className="bg-blue-600 hover:bg-blue-700 p-2 px-4 text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={props.fct ?? undefined}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );

}