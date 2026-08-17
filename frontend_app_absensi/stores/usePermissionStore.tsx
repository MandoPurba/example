import { create } from "zustand";
import axios from "axios";

import type { PermissionInput } from "@/schemas/permissionSchema";
/* =========================
   TYPE
========================= */

export interface Permission extends PermissionInput {
  id?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   CONSTANT
========================= */

/* =========================
   STORE TYPE
========================= */

interface PermissionStore {
  /* DATA */
  permissions: Permission[];

  /* PAGINATION */
  page: number;
  totalPages: number;

  setPermissions: (data: Permission[]) => void;

  setPagination: (
    page: number,
    totalPages: number
  ) => void;

  /* UI STATE */
  selectedPermission: Permission | null;

  isOpen: boolean;
  isEdit: boolean;
  isLoading: boolean;

  /* UI ACTIONS */
  openModal: () => void;

  closeModal: () => void;

  resetState: () => void;

  /* DATA ACTIONS */
  setEditPermission: (
    permission: Permission | null
  ) => void;

  loadPermissions: () => Promise<void>;

  addPermission: (
    data: PermissionInput
  ) => Promise<{
    success: boolean;
    message: string;
    id: string;
  }>;

  updatePermission: (
    id: string,
    data: PermissionInput
  ) => Promise<{
    success: boolean;
    message: string;
    id: string;
  }>;

  deletePermission: (
    id: string,
    allowUndo?: boolean
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  getPermissionById: (
    id: string
  ) => Permission | undefined;
}

/* =========================
   STORE
========================= */

export const usePermissionStore = create<PermissionStore>(
  (set, get) => ({
    permissions: [],

    selectedPermission: null,

    isOpen: false,
    isEdit: false,
    isLoading: false,

    page: 1,
    totalPages: 1,

    /* ================= SET ================= */

    setPermissions: (data) =>
      set({ permissions: data }),

    setPagination: (
      page,
      totalPages
    ) =>
      set({
        page,
        totalPages,
      }),

    /* ================= UI ================= */

    openModal: () =>
      set({ isOpen: true }),

    closeModal: () =>
      set({
        isOpen: false,
        selectedPermission: null,
        isEdit: false,
      }),

    resetState: () =>
      set({
        selectedPermission: null,
        isEdit: false,
        isOpen: false,
        isLoading: false,
      }),

    setEditPermission: (permission) =>
      set({
        selectedPermission: permission,
        isEdit: Boolean(permission),
        isOpen: true,
      }),

    /* ================= LOAD ================= */

    loadPermissions: async () => {
      set({ isLoading: true });

      try {
        const response = await axios.get(
          `/api/permissions`
        );

        set({
          permissions: response.data.data || [],
        });
      } catch (error) {
        set({ permissions: [] });
      } finally {
        set({ isLoading: false });
      }
    },

    /* ================= ADD ================= */

    addPermission: async (data) => {
      set({ isLoading: true });

      try {
        const res = await axios.post(
          `/api/permissions`,
          data,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        if (res.data.success) {
          get().loadPermissions();
        }

        return {
          success: res.data.success,
          message: res.data.message,
          id: res.data.id,
        };
      } catch (error: any) {
        return {
          success: false,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error",
          id: "",
        };
      } finally {
        set({ isLoading: false });
      }
    },

    /* ================= UPDATE ================= */

    updatePermission: async (id, data) => {
      set({ isLoading: true });

      try {
        const res = await axios.put(
          `/api/permissions/${id}`,
          data,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        if (res.data.success) {
          get().loadPermissions();
        }

        return {
          success: res.data.success,
          message: res.data.message,
          id: res.data.id,
        };
      } catch (error: any) {
        return {
          success: false,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error",
          id: "",
        };
      } finally {
        set({ isLoading: false });
      }
    },

    /* ================= DELETE ================= */

    deletePermission: async (id: string) => {
      set({ isLoading: true });

      const toDelete = get().permissions.find(
        (r) => r.id === id
      );

      if (!toDelete) {
        set({ isLoading: false });

        return {
          success: false,
          message: "Permission not found",
        };
      }

      try {
        const res = await axios.delete(`/api/permissions/${id}`);

        if (res.data.success) {
          get().loadPermissions();
        }

        return {
          success: res.data.success,
          message: res.data.message,
        };
      } catch (error: any) {
        return {
          success: false,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error",
        };
      } finally {
        set({ isLoading: false });
      }
    },

    /* ================= GET ================= */

    getPermissionById: (id) =>
      get().permissions.find(
        (permission) => permission.id === id
      ),
  })
);