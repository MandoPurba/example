'use client'

import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

const Home = dynamic(() => import("@/blocks/home/Home"), {
    ssr: false
})

export default function index() {

    const { data: session, status } = useSession();
    const { getAttendanceUserByToday, getInsightAttendanceByUserId } = useAttendanceStore()
    const router = useRouter();
    const handleLoadAttendanceUser = useCallback(() => {
        if (session) {
            getAttendanceUserByToday(session.user.id!);
            getInsightAttendanceByUserId(session.user.id!)
        }
    }, []);

    useEffect(() => {
        if (!session) {
            router.push("/");
        } else {
            handleLoadAttendanceUser();
        }
    }, [session, router]);
    return (
        <div>
            <Home />
        </div>
    )
}
