/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useAccount } from "@/app/_hooks/use-account"
import { useEffect, useState } from "react"

export default function ProfilePage() {

    const account = useAccount()

    const [profile, setProfile] = useState<any>(null)

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")

    async function loadProfile() {
        const data = await account.getProfile()
        setProfile(data)
    }

    async function changePassword() {
        setMessage("")
        try {
            await account.changePassword(currentPassword, newPassword, confirmPassword)
            setMessage("Mot de passe changé avec succès.")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (e) {
            setMessage("Erreur lors du changement de mot de passe.")
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])

    return (
        <div className="p-6 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Mon profil</h1>

            {profile && (
                <div className="border p-4 rounded-xl mb-6">
                    <div className="font-medium">{profile.firstName} {profile.lastName}</div>
                    <div className="text-sm text-gray-500">{profile.email}</div>
                </div>
            )}

            <div className="border p-4 rounded-xl">
                <h3 className="font-medium mb-3">Changer mon mot de passe</h3>
                <div className="flex flex-col gap-2">
                    <input type="password" placeholder="Mot de passe actuel" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="border p-2 rounded" />
                    <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="border p-2 rounded" />
                    <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="border p-2 rounded" />
                    <button onClick={changePassword} className="bg-blue-500 text-white p-2 rounded">Changer</button>
                </div>
                {message && <p className="text-sm mt-2">{message}</p>}
            </div>
        </div>
    )
}