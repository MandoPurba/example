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
import { ItemRow } from "@/components/tables/ItemRow";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import { useDepartmentStore } from "@/stores/useDepartmentStore";
import { Pencil } from "lucide-react";
import ModalAccessRoute from "../ModalAccessRoute";
import { useAccessRouteDepartmentStore } from "@/stores/useAccessRouteDepartmentStore";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= SKELETON ================= */
function Skeleton({ className }: { className: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
    );
}

function SkeletonRow() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-24" />
            </TableCell>
        </TableRow>
    );
}

export default function TableBranch() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const {
        departments,
        page,
        setPagination,
        setDepartments,
        selectedAccessRouteDepartments,
        getAccessRouteByDepartmentId,
    } = useDepartmentStore();

    const { openModal } = useAccessRouteDepartmentStore();

    const totalPages = page || 1;
    const currentData = departments;

    /* ================= FETCH ================= */
    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${NEXT_PUBLIC_API_URL}/departments?search=${debouncedSearch}&page=${currentPage}&limit=${itemsPerPage}`,
                    {
                        signal: controller.signal,
                    }
                );

                const json = await res.json();

                setDepartments(json.data);
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
    }, [debouncedSearch, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    const handleSetup = (id: string) => {
        if (!id) return;

        openModal();
        getAccessRouteByDepartmentId(id);
    };

    const handleRowClick = (id: string) => {
        getAccessRouteByDepartmentId(id);
    };

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* ================= LEFT TABLE ================= */}
            <div className="space-y-2">
                <div className="mt-4 flex items-center justify-between gap-4">
                    <Input
                        type="text"
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setCurrentPage(1);
                            }
                        }}
                        className="w-64 rounded-md border bg-white px-3 py-2 text-sm"
                    />

                    <ItemRow
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                    />
                </div>

                <div className="">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell isHeader>Code</TableCell>
                                <TableCell isHeader>Name</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading
                                ? Array.from({
                                    length: itemsPerPage,
                                }).map((_, i) => <SkeletonRow key={i} />)
                                : currentData.map((department: any) => (
                                    <TableRow
                                        key={department.id}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            handleRowClick(department.id)
                                        }
                                    >
                                        <TableCell>
                                            {department.code}
                                        </TableCell>
                                        <TableCell>
                                            {department.name}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-end">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {/* ================= RIGHT DETAIL ================= */}
            <div className="space-y-2">
                <div className="mt-4 flex items-center justify-between text-sm font-semibold text-gray-500">
                    <h1>
                        {selectedAccessRouteDepartments?.name ??
                            "Select Department"}
                    </h1>

                    {selectedAccessRouteDepartments?.id && (
                        <div
                            className="cursor-pointer"
                            onClick={() =>
                                handleSetup(
                                    selectedAccessRouteDepartments.id
                                )
                            }
                        >
                            <Pencil size={18} />
                        </div>
                    )}
                </div>

                <div className="">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell isHeader>Route</TableCell>
                                <TableCell isHeader>Path</TableCell>
                                <TableCell isHeader>Sub Routes</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {/* Frontend Routes */}
                            {selectedAccessRouteDepartments?.frontend_access_routes?.map(
                                (route: any) => (
                                    <TableRow key={route.id}>
                                        <TableCell>{route.name}</TableCell>

                                        <TableCell>{route.path ?? "-"}</TableCell>

                                        <TableCell>-</TableCell>
                                    </TableRow>
                                )
                            )}

                            {/* Subitem Routes */}
                            {selectedAccessRouteDepartments?.subitem_access_routes?.map(
                                (group: any) => (
                                    <TableRow key={group.id}>
                                        <TableCell>{group.name}</TableCell>

                                        <TableCell>{group.path ?? "-"}</TableCell>

                                        <TableCell>
                                            {group.children?.length ? (
                                                <ul className="ml-4 list-disc">
                                                    {group.children.map((child: any) => (
                                                        <li key={child.id}>
                                                            {child.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-400">
                                                    No sub routes
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}

                            {!selectedAccessRouteDepartments
                                ?.frontend_access_routes?.length &&
                                !selectedAccessRouteDepartments
                                    ?.subitem_access_routes?.length && (
                                    <TableRow>
                                        <TableCell
                                            className="py-8 text-center text-gray-400"
                                        >
                                            No route data available
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ================= MODAL ================= */}
            <ModalAccessRoute />
        </div>
    );
}