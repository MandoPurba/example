'use client'

import dynamic from "next/dynamic"

const Home = dynamic(() => import("@/views/home/index"), {
  ssr: false
})

export default function page() {
  return (
    <div>
      <Home />
    </div>
  )
}
