'use client'

import DonutChartOne from '@/components/charts/donut/DonutChartOne'
import { useAttendanceStore } from '@/stores/useAttendanceStore'
import { Clock, NotebookPen } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const { attendanceToday, insightAttendance } = useAttendanceStore()
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateTime() // set pertama kali

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])
  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '-'

    return new Date(dateString).toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      <p className="flex mb-2 justify-end">{currentTime}</p>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-4">
          <div className="flex justify-between">
            <h1 className="font-semibold">Shift</h1>
            <p className="text-sm capitalize">{today}</p>
          </div>
          <div className='flex gap-1 text-sm text-gray-500 ml-4'>
            <h1>{attendanceToday?.shift?.startTime}</h1>
            -
            <h1>{attendanceToday?.shift?.endTime}</h1>

          </div>

          <div className="flex justify-evenly items-center shadow-sm p-4 mt-4">
            {/* Check In */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-500">Check In</p>
              <div className="flex gap-1 font-medium items-center">
                <Clock size={18} color="gray" />
                <p className="text-blue-500">
                  {formatTime(attendanceToday?.checkIn)}
                </p>
              </div>
            </div>

            {/* Garis Vertikal */}
            <div className="w-px h-16 bg-gray-300 mx-4" />

            {/* Check Out */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-500">Check Out</p>
              <div className="flex gap-1 font-medium items-center">
                <Clock size={18} color="gray" />
                <p className="text-blue-500">
                  {formatTime(attendanceToday?.checkOut)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg bg-white p-4 shadow-sm">
          <DonutChartOne data={insightAttendance} />
        </div>
      </div>

      <div>
        <h1 className="mb-6 text-lg font-semibold">Menu</h1>

        <div className="flex justify-between gap-4 bg-white p-4 sm:p-6">
          <Link
            href="/home/permission/create-permission"
            className="flex flex-col items-center gap-1"
          >
            <NotebookPen size={26} />
            <p className="text-sm text-gray-500">Ijin</p>
          </Link>
          {/* <Link href={'/users'}>
            user
          </Link>
          <Link href={'/department'}>
            department
          </Link>
          <Link href={'/access-route'}>
            access-route
          </Link> */}
        </div>
      </div>
    </div>
  )
}