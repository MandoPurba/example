"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import { Ellipsis } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useRouter } from "next/navigation";
import { formatDate, formatTime } from "@/utils/util";

/* ================= SKELETON ================= */
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-6 w-10" /></TableCell>
    </TableRow>
  );
}



/* ================= MAIN COMPONENT ================= */
export default function TableAttendance() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const router = useRouter();

  /* ================= ZUSTAND ================= */
  const attendances = useAttendanceStore((s) => s.attendances);
  const deleteAttendance = useAttendanceStore((s) => s.deleteAttendance);
  const setEditAttendance = useAttendanceStore((s) => s.setEditAttendance);
  const openModal = useAttendanceStore((s) => s.openModal);

  const totalPages = Math.ceil(attendances.length / itemsPerPage);

  const currentData = attendances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= LOADING ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  /* ================= DROPDOWN ================= */
  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };
  const closeDropdown = () => setOpenDropdownId(null);

  /* ================= VIEW ================= */
  const handleView = (id: string) => {
    router.push(`/attendance-history/detail-attendance?key=${id}`);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id: string) => {
    if (confirm("Hapus data absensi ini?")) {
      deleteAttendance(id);
    }
    closeDropdown();
  };

  return (
    <div className="space-y-2">
      <div className="">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableCell isHeader>User</TableCell>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Check In</TableCell>
              <TableCell isHeader>Check Out</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Action</TableCell>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : currentData.map((att: any) => (
                  <TableRow key={att.id}>
                    <TableCell className="capitalize">{att.user.username}</TableCell>

                    <TableCell>{formatDate(att.createdAt)}</TableCell>

                    <TableCell>{att.checkIn ? formatTime(att.checkIn) : "-"}</TableCell>
                    <TableCell>{att.checkOut ? formatTime(att.checkOut) : "-"}</TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge
                        size="sm"
                        color={
                          att.status === "Present"
                            ? "success"
                            : att.status === "Late"
                            ? "warning"
                            : att.status === "Leave"
                            ? "info"
                            : "error"
                        }
                      >
                        {att.status}
                      </Badge>
                    </TableCell>

                    {/* ACTION */}
                    <TableCell className="relative">
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleDropdown(att.id!)}
                      >
                        <Ellipsis />
                      </div>

                      <Dropdown
                        isOpen={openDropdownId === att.id}
                        onClose={closeDropdown}
                        className="absolute right-0 mt-2 w-40 bg-white border shadow"
                      >
                        <DropdownItem onItemClick={() => handleView(att.id)}>
                          View detail
                        </DropdownItem>
                        <DropdownItem onItemClick={() => handleDelete(att.id!)}>
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="mt-4 flex justify-end items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">Rows per page:</p>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}