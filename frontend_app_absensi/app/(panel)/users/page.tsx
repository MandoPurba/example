import { Metadata } from "next";
import dynamic from "next/dynamic"

const User = dynamic(() => import("@/views/general/user/index"))
export const metadata: Metadata = {
  title: "User Management",
  description:
    "",
};

export default function page() {
  return (
      <User />
  )
}
