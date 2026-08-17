'use client'

import dynamic from "next/dynamic"
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import Loading from '@/components/Loading'
import { Suspense } from 'react'

const SuccessfullAttendance = dynamic(() => import("@/components/SuccessfullyAttendance"), {
    ssr: false
})

export default function page() {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <SuccessfullAttendance />
            </Suspense>
        </div>
    )
}

