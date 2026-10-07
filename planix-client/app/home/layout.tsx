/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { createContext, useEffect, useState } from "react";
import Button from "../_components/_mini-components/button";
import { useAccount } from "../_hooks/use-account";
import { usePathname, useRouter } from "next/navigation";

type AccountContextType = {
    loggedIn: boolean
    setLoggedIn: (v: boolean) => void
    fullName: string
    setFullName: (v: string) => void
}

export const AccountContext = createContext<AccountContextType | null>(null);

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>("");
    const account = useAccount();
    const pathname = usePathname();
    const [allowedPath, setAllowedPath] = useState<string | null>(null);

    


    useEffect(() => {

        const token = localStorage.getItem("token");
        const roles: string[] = JSON.parse(localStorage.getItem("roles") ?? "[]");

        setLoggedIn(!!token);
        setFullName(localStorage.getItem("fullName") ?? "");

        const isProtected = ["/home/admin", "/home/employee", "/home/profile"].some(p => pathname.startsWith(p));

        if (!token && isProtected) {
            router.replace("/home/account/login");
            return;
        }

        if (token && (pathname.startsWith("/home/account/login") || (pathname.startsWith("/home/admin") && !roles.includes("Admin")))) {
            account.redirectByRole(roles);
            return;
        }

        setAllowedPath(pathname);

    }, [pathname]);


    return (
        <div>
            <AccountContext.Provider value={{ loggedIn, setLoggedIn, fullName, setFullName }}>
                <header className="fixed inset-x-0 top-0 z-40 h-16 bg-brand-navy">
                    <div className="h-full justify-between">
                        {
                            !loggedIn && (
                            <div className="mx-auto flex h-full max-w-400 items-center px-6">
                                <Link href="/home" className="text-xl font-bold tracking-tight text-brand-cyan">
                                    PLANIX
                                </Link>
                            </div>
                            )
                        }
                        {
                            loggedIn && (
                            <div className="mx-auto flex h-full max-w-400 items-center justify-end px-6">
                                <div className="flex items-center justify-end gap-3">
                                    <span className="whitespace-nowrap text-sm font-medium text-white">
                                        {fullName}
                                    </span>
                                    <Button variant="ghost" className="px-3 py-1.5 text-sm" fct={() => router.replace("/home/profile")}>
                                        Mon profil
                                    </Button>
                                    <Button variant="ghost" className="px-3 py-1.5 text-sm" fct={() => {
                                            account.logOut()
                                            setLoggedIn(false)
                                            setFullName("")
                                        }}>
                                        Déconnexion
                                    </Button>
                                </div>
                            </div>
                            )
                        }
                    </div>
                </header>

                <main>
                    <div className="min-h-screen bg-[#f1f5f9] pt-16">
                        {allowedPath === pathname && children}
                    </div>
                </main>
            </AccountContext.Provider>
        </div>
    );


}