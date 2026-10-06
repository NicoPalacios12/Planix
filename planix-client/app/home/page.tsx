/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useAccount } from "../_hooks/use-account";
import Link from "next/link";

export default function Home() {
    const account = useAccount();
    useEffect(() => {
        const rolesJson = localStorage.getItem("roles");
        if (!rolesJson) return; // pas connecté → reste sur la page d'accueil

        const roles = JSON.parse(rolesJson);
        account.redirectByRole(roles);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-hero px-6 py-24 text-center">
            <section >
                <h1 className="text-7xl font-bold text-white md:text-7xl">
                    Bienvenue sur <span className="text-brand-cyan">Planix</span>
                </h1>
                <p className="mt-3 max-w-2xl text-balance text-2xl font-medium text-white/90 md:text-3xl">
                    Planifiez les horaires de votre équipe
                </p>
                <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                    Planix permet de créer les quarts de travail de vos employés,
                    de gérer les demandes de congé et d&apos;éviter les conflits
                    d&apos;horaire, au même endroit.
                </p>
                <Link
                    href="/home/account/login"
                    className="mt-8 inline-block rounded-md bg-brand-cyan px-6 py-3 font-medium text-[#101057] hover:brightness-110"
                >
                    Se connecter
                </Link>
            </section>

            <section className="mx-auto text-left grid max-w-4xl gap-4 px-6 pb-16 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">📅</div>
                    <h2 className="font-semibold text-white">Horaires</h2>
                    <p className="mt-1 text-sm text-white/70">Une grille hebdomadaire pour placer les quarts de chaque employé en quelques clics.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">✅</div>
                    <h2 className="font-semibold text-white">Congés</h2>
                    <p className="mt-1 text-sm text-white/70">
                        Les employés demandent leurs congés, l&apos;administrateur approuve ou refuse. Planix avertit si un quart est déjà prévu.
                    </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">👥</div>
                    <h2 className="font-semibold text-white">Employés</h2>
                    <p className="mt-1 text-sm text-white/70">
                        Créez les comptes de votre équipe. Chacun consulte son propre calendrier.
                    </p>
                </div>
            </section>
        </div>
    );
}