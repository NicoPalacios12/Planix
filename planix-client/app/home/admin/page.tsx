"use client"

import { useLeaveRequest } from "@/app/_hooks/use-leave-request"
import { useUser } from "@/app/_hooks/use-user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"


export default function AdminPage() {

    const leaveRequest = useLeaveRequest();
    const user = useUser();

    const [conges, setConges] = useState([])

    const [employees, setEmployes] = useState([])

    async function getAll() {

        const data = await leaveRequest.getAll()
        setConges(data)
    }

    async function handleUpdateStatus(id: number, status: string) {
        await leaveRequest.updateStatus(id, status)
        getAll()
    }

    async function handleDelete(id: number) {
        await leaveRequest.remove(id)
        getAll()
    }

    async function getEmployes() {
        const data = await user.getAll()
        setEmployes(data)
    }

    useEffect(() => {
        getAll()
        getEmployes()
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
                                    <div className="text-sm">Statut : {c.status}</div>
                                </div>
                                {c.status === "Pending" && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdateStatus(c.id, "Approved")} className="bg-green-500 text-white px-3 py-1 rounded">Approuver</button>
                                        <button onClick={() => handleUpdateStatus(c.id, "Rejected")} className="bg-green-500 text-white px-3 py-1 rounded">Refuser</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="horaires">

                </TabsContent>

                <TabsContent value="employes">
                    <div className="flex flex-col gap-3 mt-4">
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