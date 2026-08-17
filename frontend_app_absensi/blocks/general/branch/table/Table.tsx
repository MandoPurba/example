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
import { Ellipsis, Search } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import ModalBranch from "../ModalBranch";
import { useBranchStore } from "@/stores/useBranchStore";
import { ItemRow } from "@/components/tables/ItemRow";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import ModalDeleteBranch from "./ModalDelete";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
/* ================= SKELETON ================= */
function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
    );
}

function SkeletonRow() {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
        </TableRow>
    );
}

export default function TableBranch() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const branches = useBranchStore((s) => s.branches);
    const page = useBranchStore((s) => s.page);
    const setEditBranch = useBranchStore((s) => s.setEditBranch);
    const setPagination = useBranchStore((s) => s.setPagination);
    const setBranches = useBranchStore((s) => s.setBranches);
    const openModal = useBranchStore((s) => s.openModal);
    const setIdDelete = useBranchStore((s) => s.setIdDelete);

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const totalPages = page || 1;
    const currentData = branches;

    /* ================= FETCH ================= */
    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${NEXT_PUBLIC_API_URL}/branches?search=${debouncedSearch}&page=${currentPage}&limit=${itemsPerPage}`,
                    { signal: controller.signal }
                );

                const json = await res.json();

                setBranches(json.data);
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

    /* reset page saat limit berubah */
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    /* ================= DROPDOWN ================= */
    const toggleDropdown = (id: string) => {
        setOpenDropdownId((prev) => (prev === id ? null : id));
    };

    const closeDropdown = () => setOpenDropdownId(null);

    const handleEdit = (branch: any) => {
        setEditBranch(branch);
        openModal();
        closeDropdown();
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id: string) => {
        setIdDelete(id)
    };

    return (
        <div className="space-y-2">

            {/* ================= TOP BAR ================= */}
            <div className="mt-4 flex justify-between items-center gap-4">

                {/* SEARCH */}
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Search branch..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setCurrentPage(1);
                            }
                        }}
                        className="border bg-white px-3 py-2 rounded-md text-sm w-64"
                    />
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    <ItemRow
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                    />
                    <ModalBranch />
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="">
                <Table>

                    {/* HEADER */}
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader>Code</TableCell>
                            <TableCell isHeader>Branch</TableCell>
                            <TableCell isHeader>City</TableCell>
                            <TableCell isHeader>Address</TableCell>
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
                            : currentData.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell>{b.code}</TableCell>
                                    <TableCell>{b.name}</TableCell>
                                    <TableCell>{b.city}</TableCell>
                                    <TableCell>{b.address}</TableCell>

                                    <TableCell>
                                        <Badge
                                            size="sm"
                                            color={b.isActive ? "success" : "error"}
                                        >
                                            {b.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>

                                    {/* ACTION */}
                                    <TableCell className="relative">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => toggleDropdown(b.id!)}
                                        >
                                            <Ellipsis />
                                        </div>

                                        <Dropdown
                                            isOpen={openDropdownId === b.id}
                                            onClose={closeDropdown}
                                            className="absolute right-0 mt-2 w-40 bg-white border shadow"
                                        >
                                            <DropdownItem onItemClick={() => handleEdit(b)}>
                                                Edit
                                            </DropdownItem>

                                            {/* <DropdownItem onItemClick={() => handleDelete(b.id!)}>
                                                Delete
                                            </DropdownItem> */}
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {/* ================= FOOTER ================= */}
                <div className="mt-4 flex justify-end items-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
            <ModalDeleteBranch />
        </div>
    );
}