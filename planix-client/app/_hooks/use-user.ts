import api from "@/lib/axios"

export function useUser() {

    async function getAll() {

        const x = await api.get("/api/Users/GetUsers")
        return x.data
    }

    async function createEmployee(firstName: string, lastName: string, email: string) {
        const x = await api.post("/api/Users/CreateEmployee", {
            firstName,
            lastName,
            email
        })
        return x.data
    }

    return { getAll, createEmployee }
}