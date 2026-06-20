import axios from "axios";
import { useRouter } from "next/navigation";


export function useAccount() {

    const router = useRouter();

    const apiDomain = process.env.NEXT_PUBLIC_API_URL

    async function register(firstName: string, lastName: string, email: string, password: string, passwordConfirm: string) {

        try {
            const x = await axios.post(apiDomain + "api/Users/Register", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm
            });
            return x.data
        } catch (error) {
            
            throw error
        }

    }

    async function login(email: string, password: string) {

        try {
            const x = await axios.post(apiDomain + "api/Users/Login", {
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

    async function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("fullName")
        localStorage.removeItem("userId")
        router.push("/home/account/login");
    }

    return { register, login, logOut }

}