'use client';

import { useUserStore } from "@/stores/useUserStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { getAccessRouteByDepartmentId } = useUserStore();

  useEffect(() => {
    const departmentId = session?.user?.department_id;

    if (departmentId) {
      getAccessRouteByDepartmentId(departmentId);
    }
  }, [session?.user?.department_id, getAccessRouteByDepartmentId]);

  return <>{children}</>;
};

export default NavProvider;