"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Switch from "@/components/form/switch/Switch";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { useShiftStore } from "@/stores/useShiftStore";

import {
  shiftSchema,
  type ShiftInput,
} from "@/schemas/shiftSchema";

export default function ModalShift() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isOpen,
    openModal,
    closeModal,
    addShift,
    updateShift,
    isEdit,
    selectedShift,
    setEditShift,
  } = useShiftStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShiftInput>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      name: "",
      crossDay: false,
      startTime: "",
      endTime: "",
      graceMinutes: 0,
      description: "",
    },
  });

  /* RESET FORM */
  useEffect(() => {
    if (selectedShift) {
      reset({
        name: selectedShift.name,
        crossDay: selectedShift.crossDay,
        startTime: selectedShift.startTime,
        endTime: selectedShift.endTime,
        graceMinutes: selectedShift.graceMinutes,
        description: selectedShift.description || "",
      });
    } else {
      reset({
        name: "",
        crossDay: false,
        startTime: "",
        endTime: "",
        graceMinutes: 0,
        description: "",
      });
    }
  }, [selectedShift, reset]);

  const handleSave = async (data: ShiftInput) => {
    setIsSubmitting(true);

    try {
      let res;

      if (isEdit && selectedShift) {
        res = await updateShift(selectedShift.id!, data);
      } else {
        res = await addShift(data);
      }

      if (res.success) {
        toast.success(res.message);

        reset();

        handleClose();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* CLOSE */
  const handleClose = () => {
    reset();

    setEditShift(null);

    closeModal();
  };

  return (
    <div>
      {/* BUTTON */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditShift(null);

            openModal();
          }}
        >
          New Shift
        </Button>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEdit ? "Edit Shift" : "Tambah Shift"}
        description=""
        className="max-w-[700px]"
      >
        <form
          onSubmit={handleSubmit(handleSave)}
          className="space-y-4 p-2 lg:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* NAME */}
            <div>
              <Label>Name</Label>

              <Input
                {...register("name")}
                placeholder="Enter shift name"
              />

              <p className="text-xs text-red-500">
                {errors.name?.message}
              </p>
            </div>

            {/* GRACE */}
            <div>
              <Label>Grace Minutes</Label>

              <Input
                type="number"
                {...register("graceMinutes", {
                  valueAsNumber: true,
                })}
                placeholder="Enter grace minutes"
              />

              <p className="text-xs text-red-500">
                {errors.graceMinutes?.message}
              </p>
            </div>

            <Controller
              name="crossDay"
              control={control}
              render={({ field }) => (
                <Switch
                  label="Gross Day"
                  checked={field.value}
                  onChange={field.onChange}
                  color="gray"
                />
              )}
            />
            {/* START TIME */}
            <div>
              <Label>Start Time</Label>

              <Input
                type="time"
                {...register("startTime")}
              />

              <p className="text-xs text-red-500">
                {errors.startTime?.message}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <Label>Description</Label>

              <Input
                {...register("description")}
                placeholder="Enter description"
              />

              <p className="text-xs text-red-500">
                {errors.description?.message}
              </p>
            </div>

            {/* END TIME */}
            <div>
              <Label>End Time</Label>

              <Input
                type="time"
                {...register("endTime")}
              />

              <p className="text-xs text-red-500">
                {errors.endTime?.message}
              </p>
            </div>
          </div>

          {/* ACTION */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-5 py-4 sm:px-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>

            <Button disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}