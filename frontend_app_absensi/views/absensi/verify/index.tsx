'use client'

import dynamic from "next/dynamic"
import { useBranchStore } from "@/stores/useBranchStore"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

const VerifyFaceWeb = dynamic(() => import("@/blocks/(auth)/bio-metrics/verify/FaceScan"), {
  ssr: false
})


export default function index() {

    const session = useSession();

    const getBranchByUserId = useBranchStore((s) => s.getBranchByUserId)
    useEffect(() => {
        if (session) {
            getBranchByUserId(session.data?.user.id!)
        }
    }, [session])

    return (
        <VerifyFaceWeb />
    )
}
