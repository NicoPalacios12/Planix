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
import Button from "@/app/_components/_mini-components/button";

const tabTrigger =
    "h-auto flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-medium text-muted-foreground shadow-none after:hidden " +
    "hover:text-brand-navy " +
    "data-[state=active]:border-b-brand-navy data-[state=active]:bg-transparent data-[state=active]:text-brand-navy"

const statusStyles: Record<string, { label: string; className: string }> = {
    Pending: { label: "En attente", className: "bg-amber-100 text-amber-800" },
    Approved: { label: "Approuvé", className: "bg-green-100 text-green-800" },
    Rejected: { label: "Refusé", className: "bg-red-100 text-red-800" },
}

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
        const date = new Date(dateString + "T12:00:00") 
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
        <div className="mx-auto w-full max-w-400 px-6 py-6">
            <Tabs defaultValue="horaires">
                <TabsList variant="line" className="mb-6 w-full justify-start gap-6 border-b border-border p-0 group-data-horizontal/tabs:h-auto">
                    <TabsTrigger value="horaires" className={tabTrigger}>Horaires</TabsTrigger>
                    <TabsTrigger value="conges" className={tabTrigger}>Congés</TabsTrigger>
                </TabsList>
                <TabsContent value="conges">
                    <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h3 className="mb-4 text-base font-semibold text-card-foreground">Soumettre une demande</h3>
                            <div className="flex flex-col gap-4">
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Date de début
                                    <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Date de fin
                                    <input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Raison
                                    <input type="text" value={newReason} onChange={e => setNewReason(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <Button
                                    fct={createLeaveRequest}
                                    disabled={!newStartDate || !newEndDate}
                                    className="w-full"
                                >
                                    Soumettre
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card shadow-sm">
                            <div className="border-b px-5 py-3 text-sm font-semibold text-card-foreground">
                                Mes demandes ({myLeaveRequests.length})
                            </div>
                            <ul className="divide-border divide-y">
                                {myLeaveRequests.map((c: any) => {
                                    const status = statusStyles[c.status]
                                    return (
                                        <li key={c.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-card-foreground">{c.startDate.slice(0, 10)} → {c.endDate.slice(0, 10)}</p>
                                                {c.reason && <p className="text-sm text-muted-foreground">{c.reason}</p>}
                                            </div>
                                            {status && <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                    </div>
                </TabsContent>

                <TabsContent value="horaires">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={previousMonth} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-slate-50">←</button>
                        <h2 className="min-w-40 text-center text-lg font-semibold">{moisNoms[currentMonth]} {currentYear}</h2>
                        <button onClick={nextMonth} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-slate-50">→</button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
                        <div className="grid min-w-175 grid-cols-7 gap-px bg-border">
                            {joursAbbr.map(j => (
                                <div key={j} className="p-3 text-center text-xs font-medium uppercase tracking-widest bg-brand-navy text-white">{j}</div>
                            ))}

                            {calendarDays.map((day, index) => (
                                <div key={index} className={`flex min-h-24 flex-col gap-1 p-1.5 ${day ? "bg-card" : "bg-slate-50"}`}>
                                    {day && (
                                        <>
                                            <span className="px-1 text-xs font-medium text-muted-foreground">{day.slice(8, 10)}</span>
                                            {myShifts
                                                .filter((s: any) => s.date.slice(0, 10) === day)
                                                .map((s: any) => (
                                                    <div key={s.id} className="flex flex-col gap-0.5 rounded-md border border-l-4 border-l-brand-navy bg-card px-2.5 py-2">
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {s.startTime}h-{s.endTime}h
                                                        </span>
                                                        {s.breakMinutes > 0 && <span className="text-xs text-muted-foreground">Pause {s.breakMinutes}h</span>}
                                                    </div>
                                                ))
                                            }
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