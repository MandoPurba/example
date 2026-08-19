'use client'

import dynamic from "next/dynamic"

const AttendanceMonthly = dynamic(
  () => import("@/views/attendance-monthly/index"),
  { ssr: false }
)

export default function page() {
  return (
    <div>
      <AttendanceMonthly />
    </div>
  )
}
