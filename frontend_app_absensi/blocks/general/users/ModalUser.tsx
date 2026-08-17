"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import MultiSelect from "@/components/form/MultiSelect";
import Switch from "@/components/form/switch/Switch";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, UserInput } from "@/schemas/userSchema";

import { useUserStore } from "@/stores/useUserStore";
import { useBranchStore } from "@/stores/useBranchStore";

import { toast } from "sonner";
import { useShiftStore } from "@/stores/useShiftStore";
import Select from "@/components/form/Select";
import DatePickerSchedule from "@/components/DatePickerSchedule";
import { useDepartmentStore } from "@/stores/useDepartmentStore";
export default function ModalUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isOpen,
    openModal,
    closeModal,
    addUser,
    updateUser,
    isEdit,
    selectedUser,
    setEditUser,
  } = useUserStore();

  const branches = useBranchStore((s) => s.branches);
  const shifts = useShiftStore((s) => s.shifts)
  const departments = useDepartmentStore((s) => s.departments)

  const mappingShift = shifts.map((item) => ({
    value: item.id ?? "",
    label: item.name,
  }));
  const mappingDepartment = departments.map((item) => ({
    value: item.id ?? "",
    label: item.name,
  }));

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      isActive: false,
      branch_ids: [],
      user_profile: {
        name: "",
        email: "",
        image: "",
        phone: "",
        status: "Active",
      },
      workDates: [],
      shift_id: "",
      department_id: ""
    },
  });

  /* ================= RESET FORM ================= */
  useEffect(() => {
    if (selectedUser) {
      reset({
        username: selectedUser.username || "",
        password: "",
        isActive: selectedUser.isActive ?? false,

        branch_ids:
          selectedUser.branch_ids?.map((branch: any) =>
            typeof branch === "string" ? branch : branch.id
          ) || [],

        user_profile: {
          name: selectedUser.user_profile?.name || "",
          email: selectedUser.user_profile?.email || "",
          image: selectedUser.user_profile?.image || "",
          phone: selectedUser.user_profile?.phone || "",
          status: selectedUser.user_profile?.status || "Active",
        },
        shift_id: selectedUser.shift_id || "",
        department_id: (selectedUser.user_profile.department_id as string) || "",
        workDates: (selectedUser.workDates as any) || [],
      });
    } else {
      reset({
        username: "",
        password: "",
        isActive: false,
        branch_ids: [],
        user_profile: {
          name: "",
          email: "",
          image: "",
          phone: "",
          status: "Active",
        },
        shift_id: "",
        department_id: "",
        workDates: []
      });
    }
  }, [selectedUser, reset]);


  /* ================= SUBMIT ================= */
  const handleSave = async (data: UserInput) => {

    setIsSubmitting(true);

    try {
      let res;

      if (isEdit && selectedUser) {
        res = await updateUser(selectedUser.id!, data);
      } else {
        res = await addUser(data);
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

  /* ================= CLOSE ================= */
  const handleClose = () => {
    reset();

    setEditUser(null);

    closeModal();
  };

  return (
    <div>
      {/* BUTTON OPEN */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditUser(null);
            openModal();
          }}
        >
          New User
        </Button>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-[1200px]"
        title={isEdit ? "Edit User" : "Tambah User"}
        description="Kelola data user, branch, shift, dan jadwal kerja"
      >
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 p-2 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">

            {/* LEFT */}
            <div className="space-y-3">
              <div>
                <Label>Username</Label>
                <Input
                  {...register("username")}
                  disabled={isEdit}
                  placeholder="Enter username"
                />
                <p className="text-red-500 text-xs">
                  {errors.username?.message}
                </p>
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Enter password"
                />
                <p className="text-red-500 text-xs">
                  {errors.password?.message}
                </p>
              </div>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    label="Status Akun"
                    checked={field.value}
                    onChange={field.onChange}
                    color="gray"
                  />
                )}
              />

              <div>
                <Label>Nama</Label>
                <Input {...register("user_profile.name")} placeholder="Enter name" />
              </div>
            </div>

            {/* CENTER */}
            <div className="space-y-3">
              <div>
                <Label>Email</Label>
                <Input {...register("user_profile.email")} placeholder="Enter email" />
              </div>

              <div>
                <Label>Department</Label>
                <Select
                  options={mappingDepartment}
                  placeholder="Select department"
                  {...register("department_id")}
                />
                <p className="text-red-500 text-xs">
                  {errors.department_id?.message}
                </p>
              </div>

              <Controller
                name="branch_ids"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label="Branches"
                    options={branches.map((b) => ({
                      value: b.id ?? "",
                      text: b.name,
                    }))}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-3">
              <div>
                <Label>Shift</Label>
                <Select
                  options={mappingShift}
                  placeholder="Select shift"
                  {...register("shift_id")}
                />
                <p className="text-red-500 text-xs">
                  {errors.shift_id?.message}
                </p>
              </div>

              <Controller
                name="workDates"
                control={control}
                render={({ field }) => (
                  <DatePickerSchedule
                    id="multiple-date"
                    label="Select Schedule Work"
                    placeholder="Pilih tanggal"
                    value={field.value as any}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
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