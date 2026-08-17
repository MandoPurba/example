'use client';

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
import ModalUser from "../ModalUser";
import { Ellipsis } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Avatar from "@/components/ui/avatar/Avatar";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";
/* ================= SKELETON ================= */
function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
    );
}

function SkeletonRow() {
    return (
        <TableRow>
            {/* <TableCell><Skeleton className="h-4 w-32" /></TableCell> */}
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-6 w-10" /></TableCell>
        </TableRow>
    );
}

export default function TableUser() {
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [openImage, setOpenImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    /* ================= ZUSTAND ================= */
    const users = useUserStore((s) => s.users);
    const deleteUser = useUserStore((s) => s.deleteUser);
    const setEditUser = useUserStore((s) => s.setEditUser);
    const openModal = useUserStore((s) => s.openModal);

    const router = useRouter();
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const currentData = users.slice(
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

    /* ================= EDIT HANDLER (FIX UTAMA) ================= */
    const handleEdit = (id: string) => {
        setEditUser(id);   // simpan data ke store
        openModal();         // 🔥 WAJIB: buka modal
        closeDropdown();     // tutup dropdown
    };

    /* ================= DELETE ================= */
    const handleDelete = (id: string) => {
        if (confirm("Hapus user ini?")) {
            deleteUser(id);
        }
        closeDropdown();
    };


    const handleViewUser = (id: string) => {
        router.push(`/users/profile?id=${id}`);
        closeDropdown();
    };


    return (
        <div className="space-y-2">

            {/* MODAL */}
            <ModalUser />

            {/* TABLE */}
            <div className="">

                <Table>

                    {/* HEADER */}
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader>User</TableCell>
                            <TableCell isHeader>Face Register</TableCell>
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
                            : currentData.map((user: any) => (
                                <TableRow key={user.id}>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                         {user?.user_profile?.image ? (
                                                <Avatar
                                                    src={`/api${user.user_profile.image}`}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                    {user?.user_profile?.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {user.username}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    ID : {user.id}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div
                                            onClick={() => { setOpenImage(true), setImageUrl(user?.vector_face?.image) }}
                                        >
                                            {user?.vector_face?.image ? (
                                                <Avatar
                                                    src={`/api${user.vector_face.image}`}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                    N/A
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>
                                        <Badge
                                            size="sm"
                                            color={
                                                user.isActive === true
                                                    ? "success"
                                                    : user.isActive === false
                                                        ? "warning"
                                                        : "error"
                                            }
                                        >
                                            {user.isActive ? "Active" : "Non-Active"}
                                        </Badge>
                                    </TableCell>

                                    {/* ACTION */}
                                    <TableCell className="relative">

                                        <div
                                            className="cursor-pointer"
                                            onClick={() => toggleDropdown(user.id)}
                                        >
                                            <Ellipsis />
                                        </div>

                                        <Dropdown
                                            isOpen={openDropdownId === user.id}
                                            onClose={closeDropdown}
                                            className="absolute right-0 mt-2 w-40 bg-white border shadow"
                                        >

                                            <DropdownItem
                                                onItemClick={() => handleEdit(user.id)}
                                            >
                                                Edit
                                            </DropdownItem>

                                            <DropdownItem
                                                onItemClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </DropdownItem>
                                            <DropdownItem
                                                onItemClick={() => handleViewUser(user.id)}
                                            >
                                                View User
                                            </DropdownItem>
                                        </Dropdown>

                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>

                </Table>

                {/* PAGINATION */}
                <div className="mt-4 flex justify-end items-center gap-4">
                    <div className="flex items-center justify-between mb-3">

                        {/* LEFT INFO */}
                        <p className="text-sm text-gray-500 mr-2">
                            Showing {itemsPerPage} entries per page
                        </p>

                        {/* RIGHT SELECT */}
                        <div className="flex items-center gap-2">
                            <select
                                className="border rounded-md px-2 py-1 text-sm"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
                {openImage && (
                    <Modal isOpen={openImage} onClose={() => setOpenImage(false)}>
                        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                            <div className="relative max-w-lg w-full p-4">
                                <img
                                    src={`/api${imageUrl}`}
                                    alt=""
                                    width={500}
                                    height={500}
                                    className="rounded-lg w-full h-auto"
                                />
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}