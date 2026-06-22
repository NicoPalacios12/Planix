/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useAccount } from "../_hooks/use-account";

export default function Home() {
    const account = useAccount();
    useEffect(() => {
        const rolesJson = localStorage.getItem("roles");
        if (!rolesJson) return; // pas connecté → reste sur la page d'accueil

        const roles = JSON.parse(rolesJson);
        account.redirectByRole(roles);
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Bienvenue sur PLANIX</h1>
        </div>
    );
}