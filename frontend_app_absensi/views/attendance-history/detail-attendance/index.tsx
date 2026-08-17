'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import dynamic from "next/dynamic"

const DetailAbsensi = dynamic(() => import("@/components/DetailAbsensi"), {
    ssr: false
})
export default function index() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Detail Attendance" />
            <DetailAbsensi />
        </div>
    )
}
