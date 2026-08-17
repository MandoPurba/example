import dynamic from "next/dynamic";

const Login = dynamic(() => import("@/views/(auth)/login/index"));

export default function Page() {
  return (
    <Login />
  )
}