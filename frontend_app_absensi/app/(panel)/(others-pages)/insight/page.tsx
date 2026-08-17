'use client'

import dynamic from "next/dynamic"

const Insight = dynamic(() => import("@/views/insight/index"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <Insight />
    </div>
  )
}
