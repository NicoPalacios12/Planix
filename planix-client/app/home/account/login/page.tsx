"use client"

import useInputBinding from "@/app/_hooks/use-input-binding";
import { useAccount } from "@/app/_hooks/use-account"
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Button from "@/app/_components/_mini-components/button";
import { AccountContext } from "../../../home/layout";

export default function Login() {


    const account = useAccount();
    const router = useRouter();

    const email = useInputBinding("")
    const password = useInputBinding("")


    const context = useContext(AccountContext)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")


    if (!context) throw new Error("Login doit être utilisé dans un HomeLayout")

    const { setLoggedIn, setFullName } = context

    async function tryLogin() {
        if (isLoading) return
        setError("")

        if (!email.value.trim() || !password.value.trim()) {
            setError("Tous les champs doivent être remplis.")
            return
        }

        if (!email.value.includes("@")) {
            setError("Adresse courriel invalide.")
            return
        }
        setIsLoading(true)

        try {
            const data = await account.login(email.value, password.value)

            setLoggedIn(true)
            setFullName(data.fullName)

            account.redirectByRole(data.roles)

        } catch (e) {
            setError("Identifiants incorrects.")
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <div className="flex justify-center">
            <div className="bg-white w-sm p-8 rounded-xl mt-5">
                <div className="text-xl font-bold text-center mb-3">Connexion</div>
                <div className="text-sm text-gray-600 text-center">Saisissez votre email et votre mot de passe.</div>
                <div className="mt-3 [&>*]:bg-gray-100 [&>*]:p-3 [&>*]:rounded-xl flex flex-col gap-3 [&>*]:focus:outline-none">
                    <input type="email" placeholder="Adresse courriel" {...email} />
                    <input type="password" placeholder="Mot de passe" {...password} />
                </div>
                <div className="text-red-500 pt-3">{error}</div>
                <hr className="mb-3 mt-1" />
                <div className="flex [&>*]:flex-1">
                    <Button fct={tryLogin} disabled={isLoading}>
                        {isLoading ? "Chargement..." : "Se connecter"}
                    </Button>
                </div>
            </div>
        </div>

    );
}