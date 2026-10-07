/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */


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

function getInitials(name: string) {
    return (name ?? "").split(" ").filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("")
}
export default function AdminPage() {

    const leaveRequest = useLeaveRequest();
    const user = useUser();
    const schedule = useSchedule();
    const shift = useShift();

    //LEAVE REQUESTS
    const [conges, setConges] = useState([])
    const[pendingConge, setPendingConge] = useState<any | null>(null)

    //EMPLOYEES
    const [employees, setEmployes] = useState([])
    const [newFirstName, setNewFirstName] = useState("")
    const [newLastName, setNewLastName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [tempPasswordResult, setTempPasswordResult] = useState<string | null>(null)

    //SCHEDULES
    const [schedules, setSchedules] = useState([])

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
        const sunday = new Date()
        sunday.setHours(0, 0, 0, 0)
        sunday.setDate(sunday.getDate() - sunday.getDay())
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
        const date = new Date(dateString  + "T12:00:00") 
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
        try{
            await leaveRequest.updateStatus(id, status)
            getAll()
        }
        catch (error: any) {
            if(error.response?.status === 409){
                const conge = conges.find((c: any) => c.id === id)
                setPendingConge(conge)
            } else{
                console.error(error)
            }
        }
            
        
    }

    async function confirmLeaveRequest() {
        if(!pendingConge) return
        try{
            await leaveRequest.updateStatus(pendingConge.id, "Approved", true)
            setPendingConge(null)
            getAll()
            getSchedules()
        }catch(error){
            console.error(error)
        }
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
                userSchedule = await schedule.create(weekDays[0] + "T12:00:00", weekDays[6] + "T12:00:00", selectedCell.userId)
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
        <div className="mx-auto w-full max-w-400 px-6 py-6">
            <Tabs defaultValue="horaires">
                <TabsList variant="line" className="mb-6 w-full justify-start gap-6 border-b border-border p-0 group-data-horizontal/tabs:h-auto">
                    <TabsTrigger value="conges" className={tabTrigger}>Congés</TabsTrigger>
                    <TabsTrigger value="horaires" className={tabTrigger}>Horaires</TabsTrigger>
                    <TabsTrigger value="employes" className={tabTrigger}>Employés</TabsTrigger>
                </TabsList>
                <TabsContent value="conges">
                    <div className="flex flex-col gap-3">
                        {conges.map((c: any) => {
                            const status = statusStyles[c.status]
                            return (
                                <div key={c.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-sm font-semibold text-brand-navy">
                                            {getInitials(c.employeeFullName)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-card-foreground">{c.employeeFullName}</p>
                                            <p className="text-sm text-muted-foreground">{c.startDate.slice(0, 10)} → {c.endDate.slice(0, 10)}</p>
                                            {c.reason && <p className="text-sm text-muted-foreground">{c.reason}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {status && <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>}
                                        {c.status === "Pending" && (
                                            <>
                                                <button onClick={() => updateStatus(c.id, "Approved")}
                                                    className="rounded-md bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800">Approuver</button>
                                                <button onClick={() => updateStatus(c.id, "Rejected")}
                                                    className="rounded-md border border-red-700 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50">Refuser</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <Dialog open={pendingConge !== null} onOpenChange={(open) => !open && setPendingConge(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmer l&apos;approbation</DialogTitle>
                                <DialogDescription>
                                    Ce congé chevauche un ou plusieurs quarts déjà planifiés. 
                                    Approuver le congé supprimera ces quarts. Voulez-vous continuer ?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <button 
                                    onClick={() => setPendingConge(null)} 
                                    className="bg-gray-200 px-4 py-2 rounded">
                                    Annuler
                                </button>
                                <button 
                                    onClick={confirmLeaveRequest} 
                                    className="bg-red-500 text-white px-4 py-2 rounded">
                                    Approuver et supprimer les quarts
                                </button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="horaires">

                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={previousWeek} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-slate-50">←</button>
                        
                        <h2 className="min-w-40 text-center text-lg font-semibold">{getMonthLabel(weekDays[0])}</h2>
                        <button onClick={nextWeek} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-slate-50">→</button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
                        <div className="grid min-w-225 grid-cols-[180px_repeat(7,minmax(0,1fr))] gap-px bg-border">
                            <div className="border-b-2 border-transparent bg-brand-navy p-3 text-xs font-medium uppercase tracking-wide text-white">
                                Employé
                            </div>
                            {weekDays.map(day => (
                                <div key={day} className="p-3 text-center text-xs font-medium uppercase tracking-widest bg-brand-navy text-white">
                                    {getDayName(day)} - {day.slice(8, 10)}
                                </div>
                            ))}

                            {employees.map((e: any) => (
                                <Fragment key={e.id}>
                                    <div className="flex items-center bg-card p-3 gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-sm font-semibold text-brand-navy">
                                            {getInitials(e.firstName + " " + e.lastName)}
                                        </span>
                                        <span className="text-sm font-medium text-card-foreground">
                                            {e.firstName} {e.lastName}
                                        </span>
                                    </div>
                                    {weekDays.map(day => {
                                        const isOnApprovedLeave = conges.some((c:any) =>
                                            c.userId === e.id &&
                                            c.status === "Approved" &&
                                        day >= c.startDate.slice(0, 10) &&
                                        day <= c.endDate.slice(0, 10)
                                        )
                                    return (
                                        <div
                                            key={day}
                                            onClick={() => !isOnApprovedLeave && openShiftDialog(e.id, day)}
                                            className={`flex min-h-18 flex-col gap-1 p-1.5 ${
                                                isOnApprovedLeave
                                                    ? "cursor-not-allowed bg-card"
                                                    : "cursor-pointer bg-card hover:bg-slate-100"
                                            }`}
                                            >
                                            {isOnApprovedLeave ? (
                                                <div className="flex flex-1 flex-col justify-center items-center rounded-md bg-slate-700 px-2 py-1.5 text-white">
                                                    <span className="text-[15px] text-white/70 ">Congé</span>
                                                </div>
                                            ) : (
                                                shifts
                                                .filter((s: any) => {
                                                    const sched: any = schedules.find((sc: any) => sc.id === s.scheduleId)
                                                    return sched?.userId === e.id && s.date.slice(0, 10) === day
                                                })
                                                .map((s: any) => (
                                                    <div key={s.id} 
                                                        onClick={(ev) => { ev.stopPropagation(); openEditShiftDialog(s) }} 
                                                        className="group relative flex flex-col gap-0.5 rounded-md border border-l-4  border-l-brand-navy bg-card px-2.5 py-2 ">
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {s.startTime}h-{s.endTime}h
                                                        </span>
                                                        {s.breakMinutes > 0 && <span className="text-xs text-muted-foreground"> Pause {s.breakMinutes}h</span>}
                                                        <button
                                                            aria-label="Supprimer le quart"
                                                            onClick={(ev) => { ev.stopPropagation(); deleteShift(s.id) }}
                                                            className="absolute right-1 top-1 rounded px-1 text-red-600 opacity-0 hover:bg-red-100 focus-visible:opacity-100 group-hover:opacity-100"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))
                                            )}                                               
                                        </div>
                                    )})}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingShiftId ? "Modifier le quart" : "Ajouter un quart"}</DialogTitle>
                                <DialogDescription>Entrez les heures de début, de fin et la pause pour ce quart de travail.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Heure de début
                                    <input type="number" min={0} max={24} value={shiftStart} onChange={e => setShiftStart(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Heure de fin
                                    <input type="number" min={0} max={24} value={shiftEnd} onChange={e => setShiftEnd(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Pause (heures)
                                    <input type="number" min={0} value={shiftBreak} onChange={e => setShiftBreak(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                            </div>
                            <DialogFooter>
                                <button onClick={createShift} className="bg-blue-500 text-white px-4 py-2 rounded"> {editingShiftId ? "Modifier" : "Créer"}</button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                </TabsContent>

                <TabsContent value="employes">
                    <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h3 className="mb-4 text-base font-semibold text-card-foreground">Ajouter un employé</h3>
                            <div className="flex flex-col gap-4">
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Prénom
                                    <input type="text" value={newFirstName} onChange={e => setNewFirstName(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Nom
                                    <input type="text" value={newLastName} onChange={e => setNewLastName(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-medium">
                                    Courriel
                                    <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                                        className="rounded-md border border-border p-2 font-normal" />
                                </label>
                                <Button
                                    fct={createEmployee}
                                    disabled={!newFirstName || !newLastName || !newEmail}
                                    className="w-full"
                                >
                                    Créer l&apos;employé
                                </Button>
                            </div>

                            {tempPasswordResult && (
                                <div className="mt-4 rounded-md border border-border bg-slate-50 p-3">
                                    <p className="text-sm font-medium">Mot de passe temporaire</p>
                                    <p className="mt-1 break-all font-mono text-sm">{tempPasswordResult}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        À communiquer à l&apos;employé. Copie-le avant de quitter la page.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-border bg-card shadow-sm">
                            <div className="border-b px-5 py-3 text-sm font-semibold text-card-foreground">
                                Équipe ({employees.length})
                            </div>
                            <ul className="divide-border divide-y">
                                {employees.map((e: any) => (
                                    <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-xs font-semibold text-brand-navy">
                                            {getInitials(`${e.firstName} ${e.lastName}`)}
                                        </div>
                                        <div>
                                            <p className="truncate text-sm font-medium text-card-foreground">{e.firstName} {e.lastName}</p>
                                            <p className="truncate text-sm text-muted-foreground">{e.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}