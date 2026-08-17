'use client'

import dynamic from "next/dynamic"

const AccessRoute = dynamic(() => import("@/views/access-route/index"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <AccessRoute />
    </div>
  )
}
