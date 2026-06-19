/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useLeaveRequest } from "@/app/_hooks/use-leave-request"
import { useSchedule } from "@/app/_hooks/use-schedule";
import { useUser } from "@/app/_hooks/use-user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fragment, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useShift } from "@/app/_hooks/use-shift";

export default function EmployeeHome() {
    
    const leaveRequest = useLeaveRequest();
    const user = useUser();
    const schedule = useSchedule();
    const shift = useShift();

    const [mySchedules, setMySchedules] = useState<any[]>([])
    const [myShifts, setMyShifts] = useState<any[]>([])


    const [myLeaveRequests, setMyLeaveRequests] = useState<any[]>([])
    const [newStartDate, setNewStartDate] = useState("")
    const [newEndDate, setNewEndDate] = useState("")    
    const [newReason, setNewReason] = useState("")

    const [currentMonth, setCurrentMonth] = useState(5) // juin = index 5 (0 = janvier)
    const [currentYear, setCurrentYear] = useState(2026)
    const joursAbbr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
    const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

    const calendarDays = getCalendarDays(currentYear, currentMonth)

    function getCalendarDays(year: number, month: number) {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const startWeekday = firstDay.getDay() // 0 = dimanche
        const daysInMonth = lastDay.getDate()

        const days: (string | null)[] = []

        
        for (let i = 0; i < startWeekday; i++) {
            days.push(null)
        }

        
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            days.push(dateStr)
        }

        return days
    }

    function previousMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1)
        } else {
            setCurrentMonth(currentMonth - 1)
        }
    }

    function nextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1)
        } else {
            setCurrentMonth(currentMonth + 1)
        }
    }

    function getDayName(dateString: string) {
        const date = new Date(dateString)
        const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        return jours[date.getDay()]
    }

    async function getMyLeaveRequests() {

        const mine = await leaveRequest.getMine()
        setMyLeaveRequests(mine)
    }

    async function createLeaveRequest() {
        const userId = localStorage.getItem("userId")
        if (!userId || !newStartDate || !newEndDate) return

        await leaveRequest.create(newStartDate + "T12:00:00", newEndDate + "T12:00:00", newReason, userId)
        setNewStartDate("")
        setNewEndDate("")
        setNewReason("")
        getMyLeaveRequests()
    }

    async function getMySchedule(){

        const mine = await schedule.getMySchedule()
        setMySchedules(mine)

        const shifts = await Promise.all(mine.map((s: any) => shift.getByScheduleId(s.id)))
        setMyShifts(shifts.flat())
    }

    

    
    useEffect(() => {
        
        getMySchedule()
        getMyLeaveRequests()
    }, [])

    return (
    <div className="p-6">
        <Tabs defaultValue="horaires">
                <TabsList> 
                    <TabsTrigger value="horaires">Horaires</TabsTrigger>
                    <TabsTrigger value="conges">Congés</TabsTrigger>
                </TabsList>
                <TabsContent value="conges">
                    <div className="border p-4 rounded-xl mb-4">
                        <h3 className="font-medium mb-3">Soumettre une demande</h3>
                        <div className="flex flex-col gap-2">
                            <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className="border p-2 rounded" />
                            <input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className="border p-2 rounded" />
                            <input type="text" placeholder="Raison" value={newReason} onChange={e => setNewReason(e.target.value)} className="border p-2 rounded" />
                            <button onClick={createLeaveRequest} className="bg-blue-500 text-white p-2 rounded">Soumettre</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {myLeaveRequests.map((c: any) => (
                            <div key={c.id} className="border p-4 rounded-xl">
                                <div className="font-medium">{c.startDate.slice(0,10)} → {c.endDate.slice(0,10)}</div>
                                {c.reason && <div className="text-sm text-gray-600">{c.reason}</div>}
                                <div className="text-sm">Statut : {c.status}</div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="horaires">
                    <div className="p-6">
                        
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={previousMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">←</button>
                            <h2 className="text-xl font-bold">{moisNoms[currentMonth]} {currentYear}</h2>
                            <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">→</button>
                        </div>
                        
                            <div className="grid grid-cols-7 border">
                                {joursAbbr.map(j => (
                                    <div key={j} className="border p-2 font-medium text-center bg-gray-50">{j}</div>
                                ))}

                                {calendarDays.map((day, index) => (
                                    <div key={index} className="border p-2 min-h-[80px]">
                                        {day && (
                                            <>
                                                <div className="text-sm text-gray-500">{day.slice(8, 10)}</div>
                                                {myShifts
                                                    .filter((s: any) => s.date.slice(0, 10) === day)
                                                    .map((s: any) => (
                                                        <div key={s.id} className="bg-blue-100 text-xs p-1 rounded mt-1">
                                                            {s.startTime}h-{s.endTime}h
                                                            {s.breakMinutes  > 0 && ` (Pause ${s.breakMinutes }h)`}
                                                        </div>
                                                    ))}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                    </div>
                </TabsContent>

            </Tabs>
    </div>

)


}