"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import DropzoneComponent from "@/components/form/form-elements/DropZone";

import {
    PermissionInput,
    permissionSchema,
} from "@/schemas/permissionSchema";

import { usePermissionStore } from "@/stores/usePermissionStore";
import DatePicker from "@/components/form/date-picker";

const permissionTypes = [
    {
        value: "izin",
        label: "Izin",
    },
    {
        value: "sakit",
        label: "Sakit",
    },
    {
        value: "cuti",
        label: "Cuti",
    },
    {
        value: "dinas_luar",
        label: "Dinas Luar",
    },
];

export default function CreatePermission() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        addPermission,
        updatePermission,
        isEdit,
        selectedPermission,
    } = usePermissionStore();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PermissionInput>({
        resolver: zodResolver(permissionSchema) as any,
        defaultValues: {
            permission_type: "",
            start_date: new Date(),
            end_date: new Date(),
            start_time: "",
            end_time: "",
            description: "",
            attachment_file: null,
        },
    });

    const handleSave = async (data: PermissionInput) => {
        setIsSubmitting(true);
        console.log("data", data)
        try {
            let res;

            const payload = {
                permission_type: data.permission_type,
                start_date: data.start_date,
                end_date: data.end_date,
                start_time: data.start_time || null,
                end_time: data.end_time || null,
                description: data.description,
                attachment_file: data.attachment_file || null,
            };

            if (isEdit && selectedPermission) {
                res = await updatePermission(selectedPermission.id!, payload);
            } else {
                res = await addPermission(payload);
            }

            if (res.success) {
                toast.success(res.message);
                reset();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h4 className="mb-6 text-lg font-semibold">
                Apply Permission
            </h4>

            <form
                onSubmit={handleSubmit(handleSave)}
                className="space-y-6 bg-white p-5 lg:p-10 rounded-xl"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT */}
                    <div className="space-y-5">
                        {/* Permission Type */}
                        <div>
                            <Label>Permission Type</Label>

                            <Controller
                                control={control}
                                name="permission_type"
                                render={({ field }) => (
                                    <Select
                                        options={permissionTypes}
                                        placeholder="Select permission type"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <p className="mt-1 text-xs text-red-500">
                                {errors.permission_type?.message}
                            </p>
                        </div>

                        {/* Start Date */}
                        {/* <div>
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        id="start_date"
                                        label="Start Date"
                                        placeholder="Pilih tanggal"
                                        defaultDate={field.value}
                                        onChange={(selectedDates) => {
                                            field.onChange(selectedDates[0]);
                                        }}
                                    />
                                )}
                            />
                        </div> */}

                        {/* End Date */}
                        {/* <div>
                            <Controller
                                name="end_date"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        id="end_date"
                                        label="End Date"
                                        placeholder="Pilih tanggal"
                                        defaultDate={field.value}
                                        onChange={(selectedDates) => {
                                            field.onChange(selectedDates[0]);
                                        }}
                                    />
                                )}
                            />
                        </div> */}

                        {/* Start Time */}
                        {/* <div>
                            <Label>Start Time</Label>

                            <Input
                                type="time"
                                {...register("start_time")}
                            />

                            <p className="mt-1 text-xs text-red-500">
                                {errors.start_time?.message}
                            </p>
                        </div> */}

                        {/* End Time */}
                        {/* <div>
                            <Label>End Time</Label>

                            <Input
                                type="time"
                                {...register("end_time")}
                            />

                            <p className="mt-1 text-xs text-red-500">
                                {errors.end_time?.message}
                            </p>
                        </div> */}

                        {/* Description */}
                        <div>
                            <Label>Description</Label>

                            <Controller
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <TextArea
                                        value={field.value || ""}
                                        onChange={(value: string) =>
                                            field.onChange(value)
                                        }
                                        placeholder="Enter description"
                                    />
                                )}
                            />

                            <p className="mt-1 text-xs text-red-500">
                                {errors.description?.message}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                        <Label>Attachment</Label>

                        <div className="mt-2">
                            <Controller
                                control={control}
                                name="attachment_file"
                                render={({ field }) => (
                                    <DropzoneComponent
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <p className="mt-1 text-xs text-red-500">
                            {errors.attachment_file?.message}
                        </p>
                    </div>
                </div>

                {/* ACTION */}
                <div className="flex justify-end">
                    <Button
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting ? "Submitting..." : "Send"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

