'use client'

import dynamic from "next/dynamic"

const CreatePermission = dynamic(() => import("@/blocks/home/permissions/_components/CreatePermission"), {
    ssr: false
})

export default function createPermission() {

    return (
        <div>
            <CreatePermission />
        </div>
    )
}
