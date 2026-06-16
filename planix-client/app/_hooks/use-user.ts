import api from "@/lib/axios"

export function useUser() {

    async function getAll() {

        const x = await api.get("/api/Users/GetUsers")
        return x.data
    }

    return { getAll }
}