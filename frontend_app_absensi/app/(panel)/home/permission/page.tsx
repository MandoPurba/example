'use client'

import dynamic from "next/dynamic"

const Permission = dynamic(() => import("@/views/home/permissions/index"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <Permission />
    </div>
  )
}
