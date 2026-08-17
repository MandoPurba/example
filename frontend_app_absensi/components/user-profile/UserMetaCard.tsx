"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import Skeleton from "../ui/skeleton/Skeleton";
import Avatar from "../ui/avatar/Avatar";

export default function UserMetaCard({ selectedUser, isLoading }: any) {
  const { isOpen, openModal, closeModal } = useModal();
  const [openImage, setOpenImage] = useState(false);

  const profile = selectedUser?.user_profile;

  const handleSave = () => {
    closeModal();
  };

  return (
    <>
      <div className="p-5 border bg-white border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          {/* LEFT */}
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">

            {/* AVATAR */}
            {isLoading ? (
              <Skeleton className="w-20 h-20 rounded-full" />
            ) : (
              <div
                onClick={() => setOpenImage(true)}
              >
                <Avatar
                  src={profile?.image || "/images/user/owner.jpg"}
                  alt={profile?.name || "user"}
                />
              </div>
            )}

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

                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {profile?.department || "-"}
                    </p>

                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedUser?.address?.city || "-"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* SOCIAL */}
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">

              {isLoading ? (
                <>
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <Skeleton className="w-11 h-11 rounded-full" />
                </>
              ) : (
                <>
                  <SocialIcon href={selectedUser?.socialLinks?.facebook || "#"} color="text-blue-600">
                    <FacebookIcon />
                  </SocialIcon>

                  <SocialIcon href={selectedUser?.socialLinks?.x || "#"} color="text-black dark:text-white">
                    <XIcon />
                  </SocialIcon>

                  <SocialIcon href={selectedUser?.socialLinks?.linkedin || "#"} color="text-blue-700">
                    <LinkedInIcon />
                  </SocialIcon>

                  <SocialIcon href={selectedUser?.socialLinks?.instagram || "#"} color="text-pink-500">
                    <InstagramIcon />
                  </SocialIcon>
                </>
              )}

            </div>
          </div>

          {/* EDIT BUTTON */}
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] p-5 lg:p-10">
        <h4 className="font-semibold mb-5">Edit Personal Information</h4>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          Update your details to keep your profile up-to-date.
        </p>

        <form className="flex flex-col gap-6">
            {/* SOCIAL */}
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Social Links
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">

                {isLoading ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Facebook</Label>
                      <Input type="text" defaultValue={selectedUser?.socialLinks?.facebook || ""} />
                    </div>

                    <div>
                      <Label>X.com</Label>
                      <Input type="text" defaultValue={selectedUser?.socialLinks?.x || ""} />
                    </div>

                    <div>
                      <Label>Linkedin</Label>
                      <Input type="text" defaultValue={selectedUser?.socialLinks?.linkedin || ""} />
                    </div>

                    <div>
                      <Label>Instagram</Label>
                      <Input type="text" defaultValue={selectedUser?.socialLinks?.instagram || ""} />
                    </div>
                  </>
                )}

              </div>
            </div>

          <div className="flex items-center gap-3 px-2 mt-6 justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* IMAGE MODAL */}
      {openImage && (
        <Modal isOpen={openImage} onClose={() => setOpenImage(false)}>
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="relative max-w-lg w-full p-4">
              <Image
                src={profile?.image || "/images/user/owner.jpg"}
                alt={profile?.name || "user"}
                width={500}
                height={500}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

/* SOCIAL COMPONENT (unchanged) */
function SocialIcon({ href, children, color }: any) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 ${color}`}
    >
      {children}
    </a>
  );
}

/* ICONS */
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5V12H17l-.5 3h-2.5v7A10 10 0 0 0 22 12z" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h3l-7.5 8.6L22 22h-6.5l-5-6.6L4 22H1l8-9.2L2 2h6.5l4.5 6L18 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm1 6H3v12h2V9zm5 0H8v12h2v-6c0-3 4-3.2 4 0v6h2v-7c0-5-5-4.8-6-2V9z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
  </svg>
);