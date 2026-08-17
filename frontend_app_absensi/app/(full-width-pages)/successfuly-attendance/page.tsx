import dynamic from "next/dynamic";

const SuccessfulAttendance = dynamic(() => import("@/views/successful-attendance/index"));

export default function Page() {
  return (
    <SuccessfulAttendance />
  )
}