'use client'

import dynamic from "next/dynamic";

const RegisterFaceWeb = dynamic(() => import("@/blocks/(auth)/bio-metrics/register/RegisterFaceWeb"), {
  ssr: false
})

export default function index() {

    return (
        <RegisterFaceWeb />
    )
}
