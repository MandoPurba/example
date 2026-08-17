'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { useAttendanceStore } from "@/stores/useAttendanceStore"
import dynamic from "next/dynamic"
import { useEffect } from "react"

const TableAttendance = dynamic(() => import("@/blocks/attendance-user/table/Table"), {
    ssr: false
})

export default function index() {
    const fetchAttendances = useAttendanceStore((s) => s.fetchAttendances)
    useEffect(() => {
        fetchAttendances()
    }, [])

    return (
        <div>
            <PageBreadcrumb pageTitle="Attendance" />
            <TableAttendance />
        </div>
    )
}
