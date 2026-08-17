"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { Check, Trash2, X } from "lucide-react";
import { ItemRow } from "@/components/tables/ItemRow";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import { usePermissionStore } from "@/stores/usePermissionStore";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= SKELETON ================= */
function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200 ${className}`}
        />
    );
}

function SkeletonRow() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-4 w-28" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-24" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-32" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-24" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-40" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-20" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-8 w-24" />
            </TableCell>
        </TableRow>
    );
}

/* ================= DATE FORMAT ================= */
const formatDate = (date: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

export default function TablePermission() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const {
        permissions,
        page,
        deletePermission,
        setPagination,
        setPermissions,
    } = usePermissionStore();

    const totalPages = page || 1;
    const currentData = permissions;

    /* ================= FETCH ================= */
    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${NEXT_PUBLIC_API_URL}/permissions?search=${debouncedSearch}&page=${currentPage}&limit=${itemsPerPage}`,
                    {
                        signal: controller.signal,
                    }
                );

                const json = await res.json();

                setPermissions(json.data);
                setPagination(json.page, json.totalPages);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [
        debouncedSearch,
        currentPage,
        itemsPerPage,
        setPermissions,
        setPagination,
    ]);

    /* reset page saat limit berubah */
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    /* ================= DELETE ================= */
    const handleDelete = (id: string) => {
        if (confirm("Hapus permission ini?")) {
            deletePermission(id);
        }
    };

    return (
        <div className="space-y-4">
            {/* ================= TOP BAR ================= */}
            <div className="flex justify-between items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search permission..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border bg-white px-3 py-2 rounded-md text-sm w-64"
                />

                <ItemRow
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                />
            </div>

            {/* ================= TABLE ================= */}
            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader>User</TableCell>
                            <TableCell isHeader>Type</TableCell>
                            <TableCell isHeader>Date</TableCell>
                            <TableCell isHeader>Time</TableCell>
                            <TableCell isHeader>Status</TableCell>
                            <TableCell isHeader>Description</TableCell>
                            <TableCell isHeader>Attachment</TableCell>
                            <TableCell isHeader>Action</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: itemsPerPage }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))
                        ) : currentData && (
                            currentData.map((permission: any) => (
                                <TableRow key={permission.id}>
                                    {/* USER */}
                                    <TableCell>
                                        {permission.user?.username || "-"}
                                    </TableCell>

                                    {/* TYPE */}
                                    <TableCell>
                                        <span className="capitalize">
                                            {permission.permission_type
                                                ?.replaceAll("_", " ")
                                                ?.replace(/\b\w/g, (c: string) =>
                                                    c.toUpperCase()
                                                )}
                                        </span>
                                    </TableCell>

                                    {/* DATE */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>
                                                {formatDate(permission.start_date)}
                                            </span>

                                            {permission.end_date &&
                                                permission.end_date !==
                                                permission.start_date && (
                                                    <span className="text-xs text-gray-500">
                                                        s/d{" "}
                                                        {formatDate(
                                                            permission.end_date
                                                        )}
                                                    </span>
                                                )}
                                        </div>
                                    </TableCell>

                                    {/* TIME */}
                                    <TableCell>
                                        {permission.start_time ? (
                                            <span>
                                                {permission.start_time}
                                                {permission.end_time &&
                                                    ` - ${permission.end_time}`}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${permission.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : permission.status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {permission.status}
                                        </span>
                                    </TableCell>

                                    {/* DESCRIPTION */}
                                    <TableCell className="max-w-xs">
                                        <div className="truncate">
                                            {permission.description || "-"}
                                        </div>
                                    </TableCell>

                                    {/* ATTACHMENT */}
                                    <TableCell>
                                        {permission.attachment_url ? (
                                            <a
                                                href={permission.attachment_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                View File
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>

                                    {/* ACTION */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 rounded-md text-green-600 hover:bg-green-50"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>

                                            <button
                                                className="p-2 rounded-md text-red-600 hover:bg-red-50"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(permission.id)
                                                }
                                                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* ================= PAGINATION ================= */}
                <div className="p-4 flex justify-end">
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
