'use client'

import dynamic from "next/dynamic"

const CreatePermission = dynamic(() => import("@/views/home/permissions/create-permission"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <CreatePermission />
    </div>
  )
}
