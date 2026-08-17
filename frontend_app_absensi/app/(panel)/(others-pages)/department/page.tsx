
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { Metadata } from "next";
import dynamic from "next/dynamic"

const Department = dynamic(() => import("@/views/general/department/index"))
export const metadata: Metadata = {
  title: "Department Management",
  description:
    "",
};

export default function page() {
  return (
    <div>
      <Department />
    </div>
  )
}
