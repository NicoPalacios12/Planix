import api from "@/lib/axios"
import { useRouter } from "next/navigation";


export function useAccount() {

    const router = useRouter();


    async function login(email: string, password: string) {

        try {
            const x = await api.post("/api/Users/Login", {
                email: email,
                password: password,
            });
            localStorage.setItem("token", x.data.token);
            localStorage.setItem("roles", JSON.stringify(x.data.roles));
            localStorage.setItem("fullName", x.data.fullName)
            localStorage.setItem("userId", x.data.userId)

            
            return x.data
        } catch (error) {
            
            throw error
        }

    }

    async function getProfile(){
        const x = await api.get("/api/Users/GetProfil/me")
        return x.data
    }

    async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        const x = await api.post("/api/Users/ChangePassword", {
            currentPassword,
            newPassword,
            confirmPassword
        })
        return x.data
    }

    async function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("fullName")
        localStorage.removeItem("userId")
        router.push("/home/account/login");
    }

    function redirectByRole(roles: string[]){
        if (roles?.includes("Admin")) {
            router.push("/home/admin");
        } else {
            router.push("/home/employee");
        }
    }

    return { login, getProfile, changePassword, logOut, redirectByRole }

}