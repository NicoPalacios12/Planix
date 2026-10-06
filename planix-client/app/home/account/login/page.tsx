"use client"

import useInputBinding from "@/app/_hooks/use-input-binding";
import { useAccount } from "@/app/_hooks/use-account"
import { useContext, useState } from "react";
import { isAxiosError } from "axios";
import Button from "@/app/_components/_mini-components/button";
import { AccountContext } from "../../../home/layout";

const inputClass = "rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-cyan"

const demoAccounts = [
    { label: "Administrateur", email: "admin@exemple.com", password: "Planix2026!" },
    { label: "Employé", email: "daniela.sol@exemple.com", password: "Planix2268$" },
]

export default function Login() {

    const account = useAccount();

    const email = useInputBinding("")
    const password = useInputBinding("")

    const context = useContext(AccountContext)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")


    if (!context) throw new Error("Login doit être utilisé dans un HomeLayout")

    const { setLoggedIn, setFullName } = context

    async function tryLogin(emailValue: string, passwordValue: string) {
        if (isLoading) return
        setError("")

        if (!emailValue.trim() || !passwordValue.trim()) {
            setError("Tous les champs doivent être remplis.")
            return
        }

        if (!emailValue.includes("@")) {
            setError("Adresse courriel invalide.")
            return
        }
        setIsLoading(true)

        try {
            const data = await account.login(emailValue, passwordValue)

            setLoggedIn(true)
            setFullName(data.fullName)

            account.redirectByRole(data.roles)

        } catch (e) {
            if (isAxiosError(e) && !e.response) {
                setError("Impossible de joindre le serveur. Réessayez dans un instant.")
            } else {
                setError("Identifiants incorrects.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-hero px-6 py-24 text-white">
            <p className="mb-8 text-5xl font-bold tracking-tight text-brand-cyan">Planix</p>

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40">
                <h1 className="text-center text-2xl font-semibold">Connexion</h1>
                <p className="mb-6 mt-1 text-center text-sm text-white/60">
                    Accédez à vos horaires et à vos congés.
                </p>

                <form
                    onSubmit={(e) => { e.preventDefault(); tryLogin(email.value, password.value) }}
                    className="flex flex-col gap-4 text-left"
                >
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-white/80">
                        Courriel
                        <input type="email" autoComplete="email" placeholder="nom@exemple.com"
                            className={inputClass} value={email.value} onChange={email.onChange} />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-white/80">
                        Mot de passe
                        <input type="password" autoComplete="current-password" placeholder="••••••••"
                            className={inputClass} value={password.value} onChange={password.onChange} />
                    </label>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <Button type="submit" disabled={isLoading}
                        className="mt-2 w-full rounded-md bg-brand-cyan py-3 font-semibold text-[#101057] hover:bg-brand-cyan hover:brightness-110">
                        {isLoading ? "Chargement..." : "Se connecter"}
                    </Button>
                    {isLoading && (
                        <p className="text-center text-xs text-white/60">
                            Le serveur gratuit peut mettre jusqu&apos;à une minute à se réveiller.
                        </p>
                    )}
                </form>
                <div className="mt-6">
                    <p className="mb-2 text-center text-xs text-white/50">Essayer avec un compte démo</p>
                    <div className="grid grid-cols-2 gap-3">
                        {demoAccounts.map((d) => (
                        <button
                            key={d.label}
                            type="button"
                            disabled={isLoading}
                            onClick={() => {
                                email.setValue(d.email)
                                password.setValue(d.password)
                                tryLogin(d.email, d.password)
                            }}
                            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {d.label}
                        </button>
                    ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
}
