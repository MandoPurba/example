'use client'

import dynamic from "next/dynamic"

const DetailAttendanceUser = dynamic(() => import("@/views/attendance-history/detail-attendance/index"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <DetailAttendanceUser />
    </div>
  )
}
