"use client"

import useInputBinding from "@/app/_hooks/use-input-binding";
import { useAccount } from "@/app/_hooks/use-account"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/app/_components/_mini-components/button";

export default function Register() {

    const account = useAccount();
    const router = useRouter();

    const firstName = useInputBinding("")
    const lastName = useInputBinding("")
    const email = useInputBinding("")
    const password = useInputBinding("")
    const passwordConfirm = useInputBinding("")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")

    async function tryRegister() {
        if (isLoading) return
        setError("")


        if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value.trim() || !passwordConfirm.value.trim()) {
            setError("Tous les champs doivent être remplis.")
            return
        }

        if (password.value !== passwordConfirm.value) {
            setError("Les mots de passe ne correspondent pas.")
            return
        }

        if (!email.value.includes("@")) {
            setError("Adresse courriel invalide.")
            return
        }
        setIsLoading(true)
        try {
            await account.register(firstName.value, lastName.value, email.value, password.value, passwordConfirm.value)

            router.push("/home/account/login")
        } catch (e) {
            setError("Inscription échouée. Cet email est peut-être déjà utilisé.")
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <div className="flex justify-center">
            <div className="bg-white w-sm p-8 rounded-xl mt-5">
                <div className="text-xl font-bold text-center mb-3">Inscription</div>
                <div className="text-sm text-gray-600 text-center">Entrez vos informations pour vous inscrire.</div>
                <div className="mt-3 [&>*]:bg-gray-100 [&>*]:p-3 [&>*]:rounded-xl flex flex-col gap-3 [&>*]:focus:outline-none">
                    <input type="text" placeholder="Prenom" {...firstName} />
                    <input type="text" placeholder="Nom de famille" {...lastName} />
                    <input type="email" placeholder="Adresse courriel" {...email} />
                    <input type="password" placeholder="Mot de passe" {...password} />
                    <input type="password" placeholder="Confirmer le mot de passe" {...passwordConfirm} />
                </div>
                <div className="text-red-500 pt-3">{error}</div>
                <hr className="mb-3 mt-1" />
                <div className="flex [&>*]:flex-1">
                    <Button fct={tryRegister} disabled={isLoading}>
                        {isLoading ? "Chargement..." : "S'inscrire"}
                    </Button>
                </div>
            </div>
        </div>

    );
}