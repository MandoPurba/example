'use client'

import { usePermissionStore } from "@/stores/usePermissionStore";
import dynamic from "next/dynamic"
import { useEffect } from "react";

const Permission = dynamic(() => import("@/blocks/home/permissions/Permission"), {
    ssr: false
})

export default function index() {
      const { loadPermissions } = usePermissionStore();
    
    
    useEffect(() => {
        loadPermissions();
    }, [])
    return (
        <div>
            <Permission />
        </div>
    )
}
