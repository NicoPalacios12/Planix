import api from "@/lib/axios"

export function useShift() {

    async function getAll() {
        const x = await api.get("/api/Shifts")
        return x.data
    }

    async function getByScheduleId(scheduleId: number) {
        const x = await api.get(`/api/Shifts/schedule/${scheduleId}`)
        return x.data
    }

    async function getById(id: number) {
        const x = await api.get(`/api/Shifts/${id}`)
        return x.data
    }

    async function create(dayOfWeek: string, date: string, startTime: number, endTime: number, breakMinutes: number, scheduleId: number) {
        const x = await api.post("/api/Shifts", { dayOfWeek, date, startTime, endTime, breakMinutes, scheduleId })
        return x.data
    }

    async function update(id: number, shift: any) {
        const x = await api.put(`/api/Shifts/${id}`, shift)
        return x.data
    }

    async function remove(id: number) {
        const x = await api.delete(`/api/Shifts/${id}`)
        return x.data
    }

    return { getAll, getByScheduleId, getById, create, update, remove }
}