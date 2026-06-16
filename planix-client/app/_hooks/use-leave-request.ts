import api from "@/lib/axios"

export function useLeaveRequest() {

    async function getAll() {
        const x = await api.get("/api/LeaveRequests")

        return x.data;
    }

    async function getMine() {
        const x = await api.get("/api/LeaveRequests/mine")

        return x.data;
    }

    async function create(startDate: string, endDate: string, userId: string) {
        const x = await api.post("/api/LeaveRequests", { startDate, endDate, userId })

        return x.data;
    }

    async function updateStatus(id: number, status: string) {
        const x = await api.patch("/api/LeaveRequests/" + id, { status })

        return x.data;
    }

    async function remove(id: number) {
        const x = await api.delete("/api/LeaveRequests/" + id)

        return x.data;
    }

    return { getAll, getMine, create, updateStatus, remove }

}