'use client'

import React, { useCallback, useEffect } from 'react'
import { useBranchStore } from '@/stores/useBranchStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic"
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const TableBranch = dynamic(() => import("@/blocks/general/branch/table/Table"), {
    ssr: false
})
export default function index() {
    const { data: session } = useSession();
    const loadBranches = useBranchStore((s) => s.loadBranches);
    const router = useRouter();
    const handleLoadBranches = useCallback(() => {
        if (session) {
            loadBranches();
        }
    }, []);

    useEffect(() => {
        if (!session) {
            router.push("/");
        } else {
            handleLoadBranches();
        }
    }, [session]);

    return (
        <div>
                  <PageBreadcrumb pageTitle="Branch" />
                    <TableBranch />
        </div>
    )
}


