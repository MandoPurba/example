import dynamic from "next/dynamic";

const AbsensiLocation = dynamic(() => import("@/views/absensi/location/index"));

export default function Page() {
  return (
    <AbsensiLocation />
  )
}