import dynamic from "next/dynamic";

const Absensi = dynamic(() => import("@/views/absensi/verify/index"));

export default function Page() {
  return (
    <Absensi />
  )
}