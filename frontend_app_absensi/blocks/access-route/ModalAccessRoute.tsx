"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";

import {
  AccessRouteDepartmentInput,
  accessRouteDepartmentSchema,
} from "@/schemas/accessRouteDepartmentSchema";

import { useAccessRouteDepartmentStore } from "@/stores/useAccessRouteDepartmentStore";
import { useDepartmentStore } from "@/stores/useDepartmentStore";

export default function ModalAccessRoute() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isOpen,
    closeModal,
    addAccessRouteDepartment,
    updateAccessRouteDepartment,
    accessRoutes,
    isEdit,
  } = useAccessRouteDepartmentStore();

  const { selectedAccessRouteDepartments: selectedDepartment } =
    useDepartmentStore();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccessRouteDepartmentInput>({
    resolver: zodResolver(accessRouteDepartmentSchema),
    defaultValues: {
      frontendRouteIds: [],
      subitemFrontendRouteIds: [],
    },
  });

  /* ================= INIT DATA ================= */
useEffect(() => {
  if (!selectedDepartment) {
    reset({
      frontendRouteIds: [],
      subitemFrontendRouteIds: [],
    });
    return;
  }

  const parentIds =
    selectedDepartment.frontend_access_routes?.map(
      (r: any) => r.id
    ) || [];

  const childIds =
    selectedDepartment.subitem_access_routes?.flatMap(
      (r: any) => r.children?.map((c: any) => c.id) || []
    ) || [];

  reset({
    frontendRouteIds: parentIds,
    subitemFrontendRouteIds: childIds,
  });
}, [selectedDepartment, reset]);

  /* ================= SAVE ================= */
  const handleSave = async (data: AccessRouteDepartmentInput) => {
    setIsSubmitting(true);
    console.log("Saving AccessRouteDepartment with data:", data);
    console.log(isEdit ? "Updating existing department" : "Creating new department");
    console.log("Selected Department id:", selectedDepartment.id);
    try {
      const payload: AccessRouteDepartmentInput = {
        frontendRouteIds: data.frontendRouteIds,
        subitemFrontendRouteIds: data.subitemFrontendRouteIds ?? [],
      };

      const res = selectedDepartment?.id && await updateAccessRouteDepartment(
        selectedDepartment.id,
        payload
      );

      if (res.success) {
        toast.success(res.message);

        reset({
          frontendRouteIds: [],
          subitemFrontendRouteIds: [],
        });

        handleClose();
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

  /* ================= CLOSE ================= */
  const handleClose = () => {
    reset({
      frontendRouteIds: [],
      subitemFrontendRouteIds: [],
    });
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[500px] p-6 lg:p-10"
    >
      <h4 className="mb-6 border-b pb-2 text-lg font-semibold">
        Setup Route
      </h4>

      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
   <Controller
  control={control}
  name="frontendRouteIds"
  render={({ field }) => {
    const parentValue = field.value || [];
    const childValue = watch("subitemFrontendRouteIds") || [];

    const toggleParent = (
      parentId: string,
      childIds: string[]
    ) => {
      const checked = parentValue.includes(parentId);

      if (checked) {
        field.onChange(
          parentValue.filter((id) => id !== parentId)
        );

        setValue(
          "subitemFrontendRouteIds",
          childValue.filter(
            (id) => !childIds.includes(id)
          )
        );
      } else {
        field.onChange([
          ...parentValue,
          parentId,
        ]);

        setValue(
          "subitemFrontendRouteIds",
          [
            ...new Set([
              ...childValue,
              ...childIds,
            ]),
          ]
        );
      }
    };

    const toggleChild = (
      parentId: string,
      childId: string
    ) => {
      let updatedChildren: string[];

      if (childValue.includes(childId)) {
        updatedChildren = childValue.filter(
          (id) => id !== childId
        );
      } else {
        updatedChildren = [
          ...childValue,
          childId,
        ];
      }

      setValue(
        "subitemFrontendRouteIds",
        updatedChildren
      );

      const route = accessRoutes.find(
        (r: any) => r.id === parentId
      );

      const allChildIds =
        route?.sub_items?.map((i: any) => i.id) || [];

      const hasSelectedChild =
        updatedChildren.some((id) =>
          allChildIds.includes(id)
        );

      // otomatis centang parent jika ada child dipilih
      if (
        hasSelectedChild &&
        !parentValue.includes(parentId)
      ) {
        field.onChange([
          ...parentValue,
          parentId,
        ]);
      }

      // hapus parent jika semua child tidak dipilih
      if (
        !hasSelectedChild &&
        parentValue.includes(parentId)
      ) {
        field.onChange(
          parentValue.filter(
            (id) => id !== parentId
          )
        );
      }
    };

    return (
      <div className="max-h-96 space-y-4 overflow-y-auto rounded-md border bg-gray-50 p-3">
        {accessRoutes?.map((route: any) => (
          <div
            key={route.id}
            className="space-y-2"
          >
            {/* Parent */}
            <Checkbox
              label={route.name}
              checked={parentValue.includes(
                route.id
              )}
              onChange={() =>
                route.sub_items?.length
                  ? toggleParent(
                      route.id,
                      route.sub_items.map(
                        (i: any) => i.id
                      )
                    )
                  : field.onChange(
                      parentValue.includes(
                        route.id
                      )
                        ? parentValue.filter(
                            (id: string) =>
                              id !== route.id
                          )
                        : [
                            ...parentValue,
                            route.id,
                          ]
                    )
              }
            />

            {/* Children */}
            {route.sub_items?.length > 0 && (
              <div className="ml-6 space-y-2 border-l pl-4">
                {route.sub_items.map((child: any) => (
                  <Checkbox
                    key={child.id}
                    label={child.name}
                    checked={childValue.includes(
                      child.id
                    )}
                    onChange={() =>
                      toggleChild(
                        route.id,
                        child.id
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {errors.frontendRouteIds && (
          <p className="text-xs text-red-500">
            {errors.frontendRouteIds.message}
          </p>
        )}
      </div>
    );
  }}
/>

        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>

          <Button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}