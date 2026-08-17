'use client'

import dynamic from "next/dynamic"
import { useBranchStore } from "@/stores/useBranchStore"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useAttendanceStore } from "@/stores/useAttendanceStore"

const AbsensiLocation = dynamic(() => import("@/blocks/absensi/location/AbsensiLocation"), {
    ssr: false
})


export default function index() {

    const session = useSession();
    const { getBranchByUserId } = useBranchStore()
    const { getAttendanceUserByToday } = useAttendanceStore()
    useEffect(() => {
        if (session) {
            getBranchByUserId(session.data?.user.id!)
            getAttendanceUserByToday(session.data?.user.id!)
        }
    }, [session])

    return (
        <AbsensiLocation />
    )
}
