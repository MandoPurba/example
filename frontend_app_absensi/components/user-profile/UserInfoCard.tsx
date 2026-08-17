"use client";

import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Skeleton from "../ui/skeleton/Skeleton";

export default function UserInfoCard({ selectedUser, isLoading }: any) {
  const { isOpen, openModal, closeModal } = useModal();


  const handleSave = () => {
    closeModal();
  };

  return (
    <div className="p-5 border bg-white border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        {/* LEFT */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">

            {isLoading ? (
              <>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </>
            ) : (
              <>
                <Info label="Full Name" value={selectedUser?.user_profile.name} />
                <Info label="Email" value={selectedUser?.user_profile.email} />
                <Info label="Phone" value={selectedUser?.phone} />
                <Info label="Bio" value={selectedUser?.user_profile.bio} />
              </>
            )}

          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          Edit
        </button>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] p-5 lg:p-10">
        <h4 className="font-semibold mb-5">Edit Personal Information</h4>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Update your details.
        </p>

        <form className="flex flex-col gap-6">

          <div>
            <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Personal Information
            </h5>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {isLoading ? (
                <>
                  <div>
                    <Label>Full Name</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="lg:col-span-2">
                    <Label>Bio</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Full Name</Label>
                    <Input type="text" defaultValue={selectedUser?.user_profile.name || ""} />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input type="text" defaultValue={selectedUser?.user_profile.email || ""} />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input type="text" defaultValue={selectedUser?.phone || ""} />
                  </div>

                  <div className="lg:col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" defaultValue={selectedUser?.user_profile.bio || ""} />
                  </div>
                </>
              )}

            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>

        </form>
      </Modal>
    </div>
  );
}

// reusable
function Info({ label, value }: any) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}