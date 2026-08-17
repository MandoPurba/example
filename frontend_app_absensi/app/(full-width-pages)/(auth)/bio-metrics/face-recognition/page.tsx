import dynamic from "next/dynamic";

const FaceRegister = dynamic(() => import("@/views/absensi/register/index"));

export default function Page() {
  return (
    <FaceRegister />
  )
}