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
                <header className="w-full  flex justify-between fixed z-3 bg-transparent">


                    <div className="flex items-center pr-2 gap-2">
                        {loggedIn && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{fullName}</span>
                                <Button fct={() => router.push("/home/profile")}>Mon profil</Button>
                                <Button fct={() => {
                                    account.logOut()
                                    setLoggedIn(false)
                                    setFullName("")
                                }}>Déconnexion</Button>
                            </div>
                        )}
                    </div>
                </header>

                <main>
                    <div>
                        {allowedPath === pathname && children}
                    </div>
                </main>
            </AccountContext.Provider>
        </div>
    );


}