'use client'

import dynamic from "next/dynamic"

const AttendanceHistory = dynamic(() => import("@/views/attendance-history/index"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <AttendanceHistory />
    </div>
  )
}
