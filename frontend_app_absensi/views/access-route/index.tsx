'use client'

import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic"
import { useDepartmentStore } from '@/stores/useDepartmentStore';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useAccessRouteDepartmentStore } from '@/stores/useAccessRouteDepartmentStore';

const TableAccessRoute = dynamic(() => import("@/blocks/access-route/table/Table"), {
    ssr: false
})
export default function index() {
    const { data: session } = useSession();
    const { loadDepartments } = useDepartmentStore();
    const { loadAccessRoutes } = useAccessRouteDepartmentStore()
    const router = useRouter();
    const handleLoadDatas = useCallback(() => {
        if (session) {
            loadDepartments();
            loadAccessRoutes()
        }
    }, []);

    useEffect(() => {
        if (!session) {
            router.push("/");
        } else {
            handleLoadDatas();
        }
    }, [session, router]);

    return (
        <div>
            <PageBreadcrumb pageTitle="Access Route" />
            <TableAccessRoute />
        </div>
    )
}


