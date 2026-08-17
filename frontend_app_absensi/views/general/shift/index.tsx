'use client'

import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useShiftStore } from '@/stores/useShiftStore';
import dynamic from 'next/dynamic';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const TableShift = dynamic(() => import("@/blocks/general/shift/table/Table"), {
    ssr: false,
})
export default function index() {
    const { data: session, status } = useSession();
    const loadShifts = useShiftStore((s) => s.loadShifts);
    const router = useRouter();
    const handleLoadShifts = useCallback(() => {
        if (session) {
            loadShifts();
        }
    }, []);

    useEffect(() => {
        if (!session) {
            router.push("/");
        } else {
            handleLoadShifts();
        }
    }, [session, router]);

    return (
        <div>
            <PageBreadcrumb pageTitle="Shift" />
            <TableShift />
        </div>
    )
}


