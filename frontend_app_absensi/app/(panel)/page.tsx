'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/stores/useUserStore"

export default function Page() {
  const router = useRouter()
  const { selectedAccessRouteDepartments } = useUserStore()

  useEffect(() => {
    if (selectedAccessRouteDepartments) {
      router.replace(
        selectedAccessRouteDepartments.frontend_access_routes[0].path
      )
    }
  }, [selectedAccessRouteDepartments, router])

  return null
}