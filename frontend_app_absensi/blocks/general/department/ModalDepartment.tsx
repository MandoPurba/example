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
import { useDepartmentStore } from "@/stores/useDepartmentStore";
import { DepartmentInput, departmentSchema } from "@/schemas/departmentSchema";

export default function ModalDepartment() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isOpen,
    openModal,
    closeModal,
    addDepartment,
    updateDepartment,
    isEdit,
    selectedDepartment,
    setEditDepartment,
  } = useDepartmentStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepartmentInput>({
    resolver: zodResolver(departmentSchema),

    defaultValues: {
      name: "",
      code: "",
    },
  });

  /* RESET FORM */
  useEffect(() => {
    if (selectedDepartment) {
      reset({
        name: selectedDepartment.name,
        code: selectedDepartment.code,
        isActive: selectedDepartment.isActive,
      });
    } else {
      reset({
        name: "",
        code: "",
        isActive: false,
      });
    }
  }, [selectedDepartment, reset]);

  const handleSave = async (data: DepartmentInput) => {

    setIsSubmitting(true);

    try {
      let res;

      if (isEdit && selectedDepartment) {
        res = await updateDepartment(selectedDepartment.id!, data);
      } else {
        res = await addDepartment(data);
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
    setEditDepartment(null);
    closeModal();
  };

  return (
    <div>
      {/* BUTTON */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditDepartment(null);
            openModal();
          }}
        >
          New Department
        </Button>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEdit ? "Edit Department" : "Tambah Department"}
        description=""
        className="max-w-[700px]"
      >
        <form
          onSubmit={handleSubmit(handleSave)}
          className="space-y-4 p-2 lg:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div>
                <Label>Department Name</Label>

                <Input
                  {...register("name")}
                  placeholder="Enter department name"
                />

                <p className="text-xs text-red-500">
                  {errors.name?.message}
                </p>
              </div>

              <div>
                <Label>Code</Label>

                <Input
                  {...register("code")}
                  placeholder="Enter code"
                  disabled={!isEdit}
                />

                <p className="text-xs text-red-500">
                  {errors.code?.message}
                </p>
              </div>
            </div>
            <div>
              <div>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label="Status"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
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