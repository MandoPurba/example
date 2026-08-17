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

import { useBranchStore } from "@/stores/useBranchStore";

import {
  branchSchema,
  type BranchInput,
} from "@/schemas/branchSchema";

export default function ModalBranch() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isOpen,
    openModal,
    closeModal,
    addBranch,
    updateBranch,
    isEdit,
    selectedBranch,
    setEditBranch,
  } = useBranchStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BranchInput>({
    resolver: zodResolver(branchSchema),

    defaultValues: {
      name: "",
      code: "",
      city: "",
      address: "",
      radius: 0,
      latitude: 0,
      longitude: 0,
      isActive: false,
    },
  });

  /* RESET FORM */
  useEffect(() => {
    if (selectedBranch) {
      reset({
        name: selectedBranch.name,
        code: selectedBranch.code,
        city: selectedBranch.city,
        address: selectedBranch.address,
        radius: selectedBranch.radius,
        latitude: selectedBranch.latitude,
        longitude: selectedBranch.longitude,
        isActive: selectedBranch.isActive,
      });
    } else {
      reset({
        name: "",
        code: "",
        city: "",
        address: "",
        radius: 0,
        latitude: 0,
        longitude: 0,
        isActive: false,
      });
    }
  }, [selectedBranch, reset]);

  const handleSave = async (data: BranchInput) => {

    setIsSubmitting(true);

    try {
      let res;

      if (isEdit && selectedBranch) {
        res = await updateBranch(selectedBranch.id!, data);
      } else {
        res = await addBranch(data);
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
    setEditBranch(null);
    closeModal();
  };

  return (
    <div>
      {/* BUTTON */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditBranch(null);
            openModal();
          }}
        >
          New Branch
        </Button>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEdit ? "Edit Branch" : "Tambah Branch"}
        description=""
        className="max-w-[700px]"
      >
        <form
          onSubmit={handleSubmit(handleSave)}
          className="space-y-4 p-2 lg:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-3">
              <div>
                <Label>Branch Name</Label>

                <Input
                  {...register("name")}
                  placeholder="Enter branch name"
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
                />

                <p className="text-xs text-red-500">
                  {errors.code?.message}
                </p>
              </div>

              <div>
                <Label>Radius</Label>

                <Input
                  type="number"
                  {...register("radius", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter radius"
                />

                <p className="text-xs text-red-500">
                  {errors.radius?.message}
                </p>
              </div>
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

            {/* RIGHT */}
            <div className="space-y-3">
              <div>
                <Label>City</Label>

                <Input
                  {...register("city")}
                  placeholder="Enter city"
                />

                <p className="text-xs text-red-500">
                  {errors.city?.message}
                </p>
              </div>

              <div>
                <Label>Address</Label>

                <Input
                  {...register("address")}
                  placeholder="Enter address"
                />

                <p className="text-xs text-red-500">
                  {errors.address?.message}
                </p>
              </div>

              <div>
                <Label>Latitude</Label>

                <Input
                  type="number"
                  step="any"
                  {...register("latitude", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter latitude"
                />

                <p className="text-xs text-red-500">
                  {errors.latitude?.message}
                </p>
              </div>

              <div>
                <Label>Longitude</Label>

                <Input
                  type="number"
                  step="any"
                  {...register("longitude", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter longitude"
                />

                <p className="text-xs text-red-500">
                  {errors.longitude?.message}
                </p>
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