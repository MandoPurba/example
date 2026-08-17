'use client'

import dynamic from "next/dynamic"
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import Loading from '@/components/Loading'
import { Suspense } from 'react'

const Profile = dynamic(() => import("@/blocks/general/users/profile/Profile"), {
    ssr: false
})

export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Profile" />
            <Suspense fallback={<Loading />}>
                <Profile />
            </Suspense>
        </div>
    )
}

