
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { Metadata } from "next";
import dynamic from "next/dynamic"

const Branch = dynamic(() => import("@/views/general/branch/index"))
export const metadata: Metadata = {
  title: "Branch Management",
  description:
    "",
};

export default function page() {
  return (
    <div>
      <Branch />
    </div>
  )
}
