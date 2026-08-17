'use client'

import { useBranchStore } from "@/stores/useBranchStore";
import dynamic from "next/dynamic"
import Link from "next/link";
import { useEffect } from "react";

const Insight = dynamic(() => import("@/blocks/insight/Insight"), {
    ssr: false
})

export default function index() {
    const { branches, loadBranches } = useBranchStore();


    useEffect(() => {
        loadBranches();
    }, [])
    return (
        <div>
            <Insight />
            <Link href={'/users'}>
            user
            </Link>
                <Link href={'/department'}>
            department
            </Link>
        </div>
    )
}
