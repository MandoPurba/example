"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import * as Icons from "lucide-react";
import { useSession } from "next-auth/react";

const { ChevronDown, Ellipsis, Box } = Icons;


// const navAdminItems: NavItem[] = [
//   { icon: <Home />, name: "Home", path: "/home" },
//   { icon: <Grid2x2 />, name: "Admin Dashboard", path: "/dashboard" },
//   { icon: <FingerprintPattern />, name: "Absensi", path: "/absensi" },
//   { icon: <ScanFace />, name: "Register Face", path: "/bio-metrics/face-recognition" },
//   {
//     icon: <Box />,
//     name: "Master",
//     subItems: [
//       { name: "Branch", path: "/branch", pro: false },
//       { name: "Shift", path: "/shift", pro: false },
//       { name: "Department", path: "/department", pro: false }
//     ],
//   },
//   { icon: <BookText />, name: "Attendance", path: "/attendance-user" },
//   { icon: <History />, name: "Attendance History", path: "/attendance-history" },
//   { icon: <Mail />, name: "Employe", path: "/employe" },
//   { icon: <Bell />, name: "Notification", path: "/notification" },
//   { icon: <Send />, name: "Message", path: "/message" },
//   { icon: <User />, name: "Users", path: "/users" },
//   { icon: <ClosedCaption />, name: "Access Route", path: "/access-route" },
// ];

// const navUserItems: NavItem[] = [
//   { icon: <ScanFace />, name: "Absensi", path: "/absensi" },
//   { icon: <ScanFace />, name: "Register Face", path: "/bio-metrics/face-recognition" },
//   { icon: <History />, name: "Attendance History", path: "/attendance-history" },
// ];

// // other items (optional)
// const othersItems: NavItem[] = [];

interface SubItem {
  name: string;
  path: string;
  new?: boolean;
  pro?: boolean;
}

interface NavItem {
  name: string;
  path?: string | null;
  icon: string;
  subItems?: SubItem[];
}

interface AppSidebarProps {
  nav: any;
}

const DynamicIcon = ({
  name,
  size = 18,
}: {
  name?: string;
  size?: number;
}) => {
  const LucideIcon =
    (Icons[name as keyof typeof Icons] as React.ComponentType<any>);

  return <LucideIcon size={size} />;
};

const AppSidebar = ({ nav }: AppSidebarProps) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } =
    useSidebar();

  const pathname = usePathname();
  const { data: sessionData } = useSession();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<
    Record<string, number>
  >({});

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => path === pathname,
    [pathname]
  );

  const navItems = (): NavItem[] => {
    if (!sessionData?.user || !nav) return [];

    const frontendMenus: NavItem[] =
      nav.frontend_access_routes?.map((item: any) => ({
        name: item.name,
        path: item.path,
        icon: item.icon || "Box",
      })) || [];

    const subMenus: NavItem[] =
      nav.subitem_access_routes?.map((group: any) => ({
        name: group.name,
        path: group.path,
        icon: group.icon || "Box",
        subItems:
          group.children?.map((child: any) => ({
            name: child.name,
            path: child.path,
          })) || [],
      })) || [];

    return [...frontendMenus, ...subMenus];
  };

  const handleSubmenuToggle = (
    index: number,
    menuType: "main"
  ) => {
    setOpenSubmenu((prev) =>
      prev &&
      prev.type === menuType &&
      prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  useEffect(() => {
    let submenuMatched = false;

    navItems().forEach((navItem, index) => {
      navItem.subItems?.forEach((subItem) => {
        if (isActive(subItem.path)) {
          setOpenSubmenu({
            type: "main",
            index,
          });
          submenuMatched = true;
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, sessionData]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;

      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]:
            subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main"
  ) => (
    <ul className="flex flex-col gap-1 mt-4">
      {items.map((navItem, index) => (
        <li key={navItem.name}>
          {navItem.subItems && navItem.subItems.length > 0 ? (
            <>
              <button
                onClick={() =>
                  handleSubmenuToggle(index, menuType)
                }
                className={`menu-item group ${
                  openSubmenu?.type === menuType &&
                  openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  <DynamicIcon name={navItem.icon} />
                </span>

                {(isExpanded ||
                  isHovered ||
                  isMobileOpen) && (
                  <span className="font-medium">
                    {navItem.name}
                  </span>
                )}

                {(isExpanded ||
                  isHovered ||
                  isMobileOpen) && (
                  <ChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-gray-300"
                        : ""
                    }`}
                  />
                )}
              </button>

              {(isExpanded ||
                isHovered ||
                isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[
                      `${menuType}-${index}`
                    ] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? `${
                            subMenuHeight[
                              `${menuType}-${index}`
                            ] || 0
                          }px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {navItem.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            navItem.path && (
              <Link
                href={navItem.path}
                className={`menu-item group ${
                  isActive(navItem.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(navItem.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  <DynamicIcon name={navItem.icon} />
                </span>

                {(isExpanded ||
                  isHovered ||
                  isMobileOpen) && (
                  <span className="font-medium">
                    {navItem.name}
                  </span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col lg:mt-0 top-0 px-4 left-0 bg-brand-700 dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
      ${
        isExpanded || isMobileOpen
          ? "w-[250px]"
          : isHovered
          ? "w-[250px]"
          : "w-[50px]"
      }
      ${
        isMobileOpen
          ? "translate-x-0"
          : "-translate-x-full"
      } lg:translate-x-0`}
      onMouseEnter={() =>
        !isExpanded && setIsHovered(true)
      }
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-4 flex ${
          !isExpanded && !isHovered
            ? "lg:justify-center"
            : "justify-center"
        }`}
      >
        <Link
          href="/"
          className="text-2xl text-white font-semibold italic"
        >
          {isExpanded ||
          isHovered ||
          isMobileOpen ? (
            <>
              <h1>SBB</h1>
            </>
          ) : (
            <h1>SBB</h1>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {renderMenuItems(navItems(), "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;