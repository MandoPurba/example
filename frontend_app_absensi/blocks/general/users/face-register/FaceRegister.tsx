"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import Avatar from "@/components/ui/avatar/Avatar";
import { useUserStore } from "@/stores/useUserStore";
import { useSearchParams } from "next/navigation";

export default function UserMetaCard() {

    const { isOpen, openModal, closeModal } = useModal();
    const [openImage, setOpenImage] = useState(false);
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const { selectedUser, getUserById, isLoading } = useUserStore()
    const [loading, setLoading] = useState(true)
    const profile = selectedUser?.user_profile;

    const handleSave = () => {
        closeModal();
    };

    useEffect(() => {
        if (!id) return

        const fetchData = () => {
            setLoading(true)
            getUserById(id)
            setLoading(false)
        }

        fetchData()
    }, [id, getUserById])

    if (!selectedUser) {
        return (
            <div className="flex justify-center p-4 text-gray-500">
                User tidak ditemukan
            </div>
        )
    }
    return (
        <>
            <div className="p-5 border bg-white border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">

                        {/* NAME */}
                        <div className="order-3 xl:order-2 w-full">

                            {isLoading ? (
                                <div className="flex flex-col gap-2 items-center xl:items-start">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-56" />
                                </div>
                            ) : (
                                <>
                                    <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                        {profile?.name || "-"}
                                    </h4>
                                    <div className="relative max-w-lg w-full p-4">
                                        <Image
                                            src={profile?.image || "/images/user/owner.jpg"}
                                            alt={profile?.name || "user"}
                                            width={500}
                                            height={500}
                                            className="rounded-lg w-full h-auto"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
