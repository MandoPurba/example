'use client'

import dynamic from "next/dynamic"

const Table = dynamic(
  () => import("@/blocks/attendance-monthly/Table"),
  { ssr: false }
)

export default function index() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Absensi Bulanan</h1>
      <Table />
    </div>
  )
}
