/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useLeaveRequest } from "@/app/_hooks/use-leave-request"
import { useSchedule } from "@/app/_hooks/use-schedule";
import { useUser } from "@/app/_hooks/use-user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fragment, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useShift } from "@/app/_hooks/use-shift";


export default function AdminPage() {

    const leaveRequest = useLeaveRequest();
    const user = useUser();
    const schedule = useSchedule();
    const shift = useShift();

    const [conges, setConges] = useState([])

    //EMPLOYEES
    const [employees, setEmployes] = useState([])
    const [newFirstName, setNewFirstName] = useState("")
    const [newLastName, setNewLastName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [tempPasswordResult, setTempPasswordResult] = useState<string | null>(null)

    //SCHEDULES
    const [schedules, setSchedules] = useState([])
    const [newStartDate, setNewStartDate] = useState("")
    const [newEndDate, setNewEndDate] = useState("")
    const [selectedUserId, setSelectedUserId] = useState("")

    //SHIFTS
    const [shifts, setShifts] = useState<any[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCell, setSelectedCell] = useState<{ userId: string, date: string } | null>(null)
    const [shiftStart, setShiftStart] = useState("")
    const [shiftEnd, setShiftEnd] = useState("")
    const [shiftBreak, setShiftBreak] = useState("0")
    const [editingShiftId, setEditingShiftId] = useState<number | null>(null)

    //WEEK
   const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date()
        const day = today.getDay() // 0 = dimanche
        const sunday = new Date(today)
        sunday.setDate(today.getDate() - day)
        return sunday
    })

    function getWeekDays(start: Date) {
        const days: string[] = []
        for (let i = 0; i < 7; i++) {
            const d = new Date(start)
            d.setDate(start.getDate() + i)
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            days.push(dateStr)
        }
        return days
    }

    const weekDays = getWeekDays(currentWeekStart)

    function getDayName(dateString: string) {
        const date = new Date(dateString)
        const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        return jours[date.getDay()]
    }

    function getMonthLabel(dateStr: string) {
        const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
        const date = new Date(dateStr + "T12:00:00")
        return `${moisNoms[date.getMonth()]} ${date.getFullYear()}`
    }

    function previousWeek() {
        const newStart = new Date(currentWeekStart)
        newStart.setDate(currentWeekStart.getDate() - 7)
        setCurrentWeekStart(newStart)
    }

    function nextWeek() {
        const newStart = new Date(currentWeekStart)
        newStart.setDate(currentWeekStart.getDate() + 7)
        setCurrentWeekStart(newStart)
    }

    
    //LEAVE REQUESTS
    async function getAll() {

        const data = await leaveRequest.getAll()
        setConges(data)
    }

    async function updateStatus(id: number, status: string) {
        await leaveRequest.updateStatus(id, status)
        getAll()
    }

    //EMPLOYEES
    async function getEmployes() {
        const data = await user.getAll()
        setEmployes(data)
    }

    //CREATE EMPLOYEE
    async function createEmployee() {
        if (!newFirstName || !newLastName || !newEmail) return

        const result = await user.createEmployee(newFirstName, newLastName, newEmail)
        setTempPasswordResult(result.tempPassword)

        setNewFirstName("")
        setNewLastName("")
        setNewEmail("")
        getEmployes()
    }

    //SCHEDULES
    async function getSchedules() {
        const data = await schedule.getAll()
        setSchedules(data)

        const shiftsArrays = await Promise.all(
            data.map((s: any) => shift.getByScheduleId(s.id))
        )
        setShifts(shiftsArrays.flat())
    }

    //SHIFTS
    async function deleteShift(id: number) {
        await shift.remove(id)
        getSchedules()
    }


    function openShiftDialog(userId: string, date: string) {
        setEditingShiftId(null)
        setSelectedCell({ userId, date })
        setShiftStart("")
        setShiftEnd("")
        setShiftBreak("0")
        setDialogOpen(true)
    }

    function openEditShiftDialog(s: any) {
        setEditingShiftId(s.id)
        setShiftStart(s.startTime.toString())
        setShiftEnd(s.endTime.toString())
        setShiftBreak(s.breakMinutes.toString())
        setDialogOpen(true)
    }
    async function createShift() {
        if (editingShiftId) {
            const original = shifts.find((s: any) => s.id === editingShiftId)
            await shift.update(editingShiftId, {
                id: editingShiftId,
                dayOfWeek: original.dayOfWeek,
                date: original.date,
                startTime: parseInt(shiftStart),
                endTime: parseInt(shiftEnd),
                breakMinutes: parseInt(shiftBreak),
                scheduleId: original.scheduleId
            })
        } else {

            if (!selectedCell) return
            let userSchedule: any = schedules.find((s: any) =>
                s.userId === selectedCell.userId &&
                s.startDate.slice(0, 10) <= selectedCell.date &&
                s.endDate.slice(0, 10) >= selectedCell.date
            )
            if (!userSchedule) {
                userSchedule = await schedule.create(newStartDate + "T12:00:00", newEndDate + "T12:00:00", selectedCell.userId)
            }
            if (!userSchedule) return
            await shift.create("", selectedCell.date + "T12:00:00", parseInt(shiftStart), parseInt(shiftEnd), parseInt(shiftBreak), userSchedule.id)
        }

        setDialogOpen(false)
        getSchedules()
    }

    useEffect(() => {
        getAll()
        getEmployes()
        getSchedules()
    }, [])


    return (
        <div className="p-6">
            <h1 className="text-2x1 font-bold mb-6">Dashboard Admin</h1>
            <Tabs defaultValue="horaires">
                <TabsList>
                    <TabsTrigger value="conges">Congés</TabsTrigger>
                    <TabsTrigger value="horaires">Horaires</TabsTrigger>
                    <TabsTrigger value="employes">Employés</TabsTrigger>
                </TabsList>
                <TabsContent value="conges">
                    <div className="flex flex-col gap-3 mt-4">
                        {conges.map((c: any) => (
                            <div key={c.id} className="border p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{c.employeeFullName}</div>
                                    <div className="text-sm text-gray-500">{c.startDate.slice(0, 10)} → {c.endDate.slice(0, 10)}</div>
                                    <div className="text-sm text-gray-500">{c.reason}</div>
                                    <div className="text-sm">Statut : {c.status}</div>
                                </div>
                                {c.status === "Pending" && (
                                    <div className="flex gap-2">
                                        <button onClick={() => updateStatus(c.id, "Approved")} className="bg-green-500 text-white px-3 py-1 rounded">Approuver</button>
                                        <button onClick={() => updateStatus(c.id, "Rejected")} className="bg-green-500 text-white px-3 py-1 rounded">Refuser</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="horaires">

                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={previousWeek} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">←</button>
                        
                        <h2 className="text-lg font-medium">{getMonthLabel(weekDays[0])}</h2>
                        <button onClick={nextWeek} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">→</button>
                    </div>

                   <div className="grid grid-cols-8 border">
                        <div className="border p-2 font-medium">Employé</div>
                        {weekDays.map(day => (
                            <div key={day} className="border p-2 font-medium text-center">
                                {getDayName(day).slice(0, 3)} {day.slice(8, 10)}
                            </div>
                        ))}

                        {employees.map((e: any) => (
                            <Fragment key={e.id}>
                                <div className="border p-2">{e.firstName} {e.lastName}</div>
                                {weekDays.map(day => (
                                    <div
                                        key={day}
                                        onClick={() => openShiftDialog(e.id, day)}
                                        className="border p-2 min-h-[60px] cursor-pointer hover:bg-gray-50 flex flex-col"
                                    >
                                        {shifts
                                            .filter((s: any) => {
                                                const sched: any = schedules.find((sc: any) => sc.id === s.scheduleId)
                                                return sched?.userId === e.id && s.date.slice(0, 10) === day
                                            })
                                            .map((s: any) => (
                                                <div key={s.id} onClick={(ev) => { ev.stopPropagation(); openEditShiftDialog(s) }} className="bg-blue-100 text-xs p-1 rounded mb-1 flex-1 flex justify-between items-center group">
                                                    <span>
                                                        {s.startTime}h-{s.endTime}h
                                                        {s.breakMinutes > 0 && <span className="text-gray-500"> ({s.breakMinutes}min)</span>}
                                                    </span>
                                                    <button onClick={(ev) => { ev.stopPropagation(); deleteShift(s.id) }} className="opacity-0 group-hover:opacity-100 text-red-500 px-1 font-bold">×</button>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                    
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingShiftId ? "Modifier le quart" : "Ajouter un quart"}</DialogTitle>
                                <DialogDescription>Entrez les heures de début, de fin et la pause pour ce quart de travail.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                                <input type="number" placeholder="Heure début (ex: 9)" value={shiftStart} onChange={e => setShiftStart(e.target.value)} className="border p-2 rounded" />
                                <input type="number" placeholder="Heure fin (ex: 17)" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} className="border p-2 rounded" />
                                <input type="number" placeholder="Pause (minutes)" value={shiftBreak} onChange={e => setShiftBreak(e.target.value)} className="border p-2 rounded" />
                            </div>
                            <DialogFooter>
                                <button onClick={createShift} className="bg-blue-500 text-white px-4 py-2 rounded"> {editingShiftId ? "Modifier" : "Créer"}</button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="employes">
                    <div className="border p-4 rounded-xl mb-4">
                        <h3 className="font-medium mb-3">Ajouter un employé</h3>
                        <div className="flex flex-col gap-2">
                            <input type="text" placeholder="Prénom" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} className="border p-2 rounded" />
                            <input type="text" placeholder="Nom" value={newLastName} onChange={e => setNewLastName(e.target.value)} className="border p-2 rounded" />
                            <input type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="border p-2 rounded" />
                            <button onClick={createEmployee} className="bg-blue-500 text-white p-2 rounded">Créer</button>
                        </div>

                        {tempPasswordResult && (
                            <div className="mt-3 bg-yellow-50 border border-yellow-300 p-3 rounded">
                                <p className="text-sm font-medium">Mot de passe temporaire (à communiquer à l&apos;employé) :</p>
                                <p className="font-mono">{tempPasswordResult}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        {employees.map((e: any) => (
                            <div key={e.id} className="border p-4 rounded-xl">
                                <div className="font-medium">{e.firstName} {e.lastName}</div>
                                <div className="text-sm text-gray-500">{e.email}</div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}