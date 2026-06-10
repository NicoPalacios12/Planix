"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { createContext, useEffect, useState } from "react";
import Button from "../_components/_mini-components/button";
import { useAccount } from "../_hooks/use-account";

type AccountContextType = {
    loggedIn: boolean
    setLoggedIn: (v: boolean) => void
    fullName: string
    setFullName: (v: string) => void
}

export const AccountContext = createContext<AccountContextType | null>(null);

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>("");
    const account = useAccount();


    useEffect(() => {

        if (localStorage.getItem("token")) setLoggedIn(true);
        const jsonFullName = localStorage.getItem("fullName");
        if (jsonFullName) setFullName(jsonFullName);

    }, []);


    return (
        <div>
            <AccountContext.Provider value={{ loggedIn, setLoggedIn, fullName, setFullName }}>
                <header className="w-full bg-white border-b-1 border-b-gray-300 flex justify-between fixed z-3">
                    <Link href="/home"><div className="text-orange-600 font-bold text-3xl p-3 tracking-tighter cursor-pointer">PLANIX</div></Link>

                    <div className="flex items-center pr-2 gap-2">
                        {!loggedIn && (
                            <>
                                <Link href="/home/account/register"><Button>S'inscrire</Button></Link>
                                <Link href="/home/account/login"><Button>Connexion</Button></Link>
                            </>
                        )}
                        {loggedIn && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{fullName}</span>
                                <Button fct={() => {
                                    account.logOut()
                                    setLoggedIn(false)
                                    setFullName("")
                                }}>Déconnexion</Button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="pt-[61px]">

                    <div className="ml-0 lg:ml-[250px]">
                        {children}
                    </div>
                </main>
            </AccountContext.Provider>
        </div>
    );


}