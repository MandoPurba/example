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

    // Admin (punya /insight) -> dashboard. Selain itu SELALU ke /home
    // (jangan auto ke /absensi).
    const target =
      routes.find((r: any) => r?.path === "/insight")?.path || "/home"

    router.replace(target)
  }, [selectedAccessRouteDepartments, router])

  return null
}