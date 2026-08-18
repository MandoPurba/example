'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/stores/useUserStore"

export default function Page() {
  const router = useRouter()
  const { selectedAccessRouteDepartments } = useUserStore()

  useEffect(() => {
    if (!selectedAccessRouteDepartments) return

    const routes = selectedAccessRouteDepartments.frontend_access_routes || []

    // Default landing = DASHBOARD (/insight) bila user punya aksesnya,
    // lalu /home, baru menu pertama yang punya path.
    const target =
      routes.find((r: any) => r?.path === "/insight")?.path ||
      routes.find((r: any) => r?.path === "/home")?.path ||
      routes.find((r: any) => r?.path)?.path

    if (target) {
      router.replace(target)
    }
  }, [selectedAccessRouteDepartments, router])

  return null
}