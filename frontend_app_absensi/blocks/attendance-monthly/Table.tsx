'use client'

import axios from "axios"
import { Fragment, useEffect, useState } from "react"

type Rec = {
  workDate: string
  checkIn: string | null
  checkOut: string | null
  status: string | null
}
type Row = {
  userId: string
  username: string
  name: string
  department: string
  records: Rec[]
  summary: { total: number; present: number; late: number }
}

export default function Table() {
  const now = new Date()
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const [month, setMonth] = useState(defaultMonth)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    axios
      .get(`/api/attendances/monthly?month=${month}`)
      .then((res) => { if (active) setRows(res.data?.data || []) })
      .catch(() => { if (active) setRows([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [month])

  const fmtTime = (d: string | null) =>
    d
      ? new Date(d).toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-"
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">Data absensi seluruh karyawan per bulan</p>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        />
      </div>

      {loading ? (
        <p className="py-6 text-center text-gray-500">Memuat...</p>
      ) : rows.length === 0 ? (
        <p className="py-6 text-center text-gray-500">Tidak ada data.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-2 py-2">Nama</th>
                <th className="px-2 py-2">Department</th>
                <th className="px-2 py-2 text-center">Hadir</th>
                <th className="px-2 py-2 text-center">Terlambat</th>
                <th className="px-2 py-2 text-center">Total</th>
                <th className="px-2 py-2 text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Fragment key={r.userId}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2 font-medium">{r.name}</td>
                    <td className="px-2 py-2">{r.department}</td>
                    <td className="px-2 py-2 text-center text-green-600">{r.summary.present}</td>
                    <td className="px-2 py-2 text-center text-amber-600">{r.summary.late}</td>
                    <td className="px-2 py-2 text-center">{r.summary.total}</td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => setExpanded(expanded === r.userId ? null : r.userId)}
                        className="text-blue-600 hover:underline"
                      >
                        {expanded === r.userId ? "Tutup" : "Lihat"}
                      </button>
                    </td>
                  </tr>
                  {expanded === r.userId && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50 px-4 py-2">
                        {r.records.length === 0 ? (
                          <p className="text-gray-500">Tidak ada absensi bulan ini.</p>
                        ) : (
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-left text-gray-500">
                                <th className="py-1">Tanggal</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.records.map((rec, i) => (
                                <tr key={i} className="border-t">
                                  <td className="py-1">{fmtDate(rec.workDate)}</td>
                                  <td>{fmtTime(rec.checkIn)}</td>
                                  <td>{fmtTime(rec.checkOut)}</td>
                                  <td className="capitalize">{rec.status || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
