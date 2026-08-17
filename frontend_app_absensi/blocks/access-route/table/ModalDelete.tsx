"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

import { useDepartmentStore } from "@/stores/useDepartmentStore";
export default function ModalDeleteDepartment() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        idDelete,
        isDelete,
        closeModalDelete,
        deleteDepartment,
    } = useDepartmentStore();

    const onDelete = async () => {
        setIsSubmitting(true);
        try {
            const res = await deleteDepartment(idDelete);
            if (res.success) {
                toast.success(res.message);
                handleClose();
            } else {
                toast.error(res.message);
            }
        } catch (err: any) {
            console.error(err);
            toast.error("Terjadi kesalahan saat menghapus data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        closeModalDelete();
    };

    return (
        <Modal
            isOpen={isDelete}
            onClose={handleClose}
            className="max-w-[500px] p-5 lg:p-10"
        >
            <h4 className="mb-5 font-semibold text-lg">
                Hapus Bidang
            </h4>

            <p>
                Apakah Anda yakin ingin menghapus data Bidang ini?
            </p>

            <div className="flex justify-end gap-3 mt-5">
                <Button
                    variant="outline"
                    onClick={handleClose}
                >
                    Batal
                </Button>

                <Button
                    onClick={onDelete}
                    variant="danger"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Menghapus..." : "Hapus"}
                </Button>
            </div>
        </Modal>
    );
}