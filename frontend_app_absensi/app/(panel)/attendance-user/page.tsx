'use client'

import dynamic from "next/dynamic"

const AttendanceUser = dynamic(() => import("@/views/attendance-user/index"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <AttendanceUser />
    </div>
  )
}
