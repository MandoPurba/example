'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { useAttendanceStore } from "@/stores/useAttendanceStore"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useEffect } from "react"

const TableAttendanceHistory = dynamic(() => import("@/blocks/attendance-history/table/Table"), {
    ssr: false
})

export default function index() {

    const session = useSession();

    const getAttendanceByUserId = useAttendanceStore((s) => s.getAttendanceByUserId)
    useEffect(() => {
        if (session) {
            getAttendanceByUserId(session.data?.user.id!)
        }
    }, [session])

    return (
        <div>
            <PageBreadcrumb pageTitle="Attendance History" />
            <TableAttendanceHistory />
        </div>
    )
}
