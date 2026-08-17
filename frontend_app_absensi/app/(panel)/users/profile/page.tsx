import dynamic from "next/dynamic";

const Profile = dynamic(() => import("@/views/profile/index"));

export default function Page() {
  return (
    <Profile />
  )
}