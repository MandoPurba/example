'use client'

import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import { useBranchStore } from '@/stores/useBranchStore';
import { useShiftStore } from '@/stores/useShiftStore';
import dynamic from 'next/dynamic';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useDepartmentStore } from '@/stores/useDepartmentStore';

const TableUser = dynamic(() => import("@/blocks/general/users/table/Table"), {
    ssr: false
})
export default function index() {
    const { data: session, status } = useSession();
    const loadUsers = useUserStore((s) => s.loadUsers);
    const loadBranches = useBranchStore((s) => s.loadBranches);
    const loadShifts = useShiftStore((s) => s.loadShifts);
    const loadDepartments = useDepartmentStore((s) => s.loadDepartments)
    const router = useRouter();
    const handleLoadUsers = useCallback(() => {
        if (session) {
            loadUsers();
            loadBranches();
            loadDepartments();
            loadShifts();
        }
    }, []);

    useEffect(() => {
        if (!session) {
            router.push("/");
        } else {
            handleLoadUsers();
        }
    }, [session]);

    return (
        <div>
            <PageBreadcrumb pageTitle="User" />
            <TableUser />
        </div>
    )
}


