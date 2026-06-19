/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/lib/axios"

export function useSchedule() {

    async function getAll() {

        const x = await api.get("/api/Schedules/GetSchedules")
        return x.data
    }

    async function getSchedule(id: number) {

        const x = await api.get("/api/Schedules/GetSchedule/" + id)
        return x.data
    }

    async function getMySchedule() {

        const x = await api.get("/api/Schedules/GetMySchedules/mine")
        return x.data
    }

    async function create(startDate: string, endDate: string, userId: string) {
        console.log("horaires:", startDate, endDate, userId)
        const x = await api.post("/api/Schedules/PostSchedule", { startDate, endDate, userId })
        return x.data
    }

    async function update(id: number, startDate: string, endDate: string, userId: string) {

        const x = await api.put("/api/Schedules/PuSchedule/" + id, { id, startDate, endDate, userId })
    }

    async function remove(id: number) {

        const x = await api.delete("/api/Schedules/DeleteSchedule/" + id)
        return x.data
    }

    return { getAll, getSchedule, getMySchedule, create, update, remove }
}