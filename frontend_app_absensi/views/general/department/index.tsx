'use client'

import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic"
import { useDepartmentStore } from '@/stores/useDepartmentStore';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const TableDepartment = dynamic(() => import("@/blocks/general/department/table/Table"), {
    ssr: false
})
export default function index() {
    const { data: session } = useSession();
    const { loadDepartments } = useDepartmentStore();
    const router = useRouter();
    const handleLoadDepartments = useCallback(() => {
        if (session) {
            loadDepartments();
        }
    }, []);

    useEffect(() => {
        if (!session) {
            router.push("/");
        } else {
            handleLoadDepartments();
        }
    }, [session, router]);

    return (
        <div>
            <PageBreadcrumb pageTitle="Department" />
            <TableDepartment />
        </div>
    )
}


