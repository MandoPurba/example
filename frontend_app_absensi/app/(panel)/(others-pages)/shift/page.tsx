
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { Metadata } from "next";
import dynamic from "next/dynamic"

const Shift = dynamic(() => import("@/views/general/shift/index"))
export const metadata: Metadata = {
  title: "Shift Management",
  description:
    "",
};

export default function page() {
  return (
      <Shift />
  )
}
