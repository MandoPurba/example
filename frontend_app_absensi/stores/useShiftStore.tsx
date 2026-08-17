import { create } from "zustand";
import axios from "axios";

import type { ShiftInput } from "@/schemas/shiftSchema";

/* =========================
   TYPE
========================= */

export interface Shift extends ShiftInput {
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

interface ShiftStore {
  /* DATA */
  shifts: Shift[];

  /* PAGINATION */
  page: number;
  totalPages: number;

  setShifts: (data: Shift[]) => void;

  setPagination: (
    page: number,
    totalPages: number
  ) => void;

  /* UI STATE */
  selectedShift: Shift | null;

  isOpen: boolean;
  isEdit: boolean;
  isLoading: boolean;

  /* UI ACTIONS */
  openModal: () => void;

  closeModal: () => void;

  resetState: () => void;

  /* DATA ACTIONS */
  setEditShift: (
    shift: Shift | null
  ) => void;

  loadShifts: () => Promise<void>;

  addShift: (
    data: ShiftInput
  ) => Promise<{
    success: boolean;
    message: string;
    id: string;
  }>;

  updateShift: (
    id: string,
    data: ShiftInput
  ) => Promise<{
    success: boolean;
    message: string;
    id: string;
  }>;

  deleteShift: (
    id: string,
    allowUndo?: boolean
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  getShiftById: (
    id: string
  ) => Shift | undefined;
}

/* =========================
   STORE
========================= */

export const useShiftStore = create<ShiftStore>(
  (set, get) => ({
    shifts: [],

    selectedShift: null,

    isOpen: false,
    isEdit: false,
    isLoading: false,

    page: 1,
    totalPages: 1,

    /* ================= SET ================= */

    setShifts: (data) =>
      set({ shifts: data }),

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
        selectedShift: null,
        isEdit: false,
      }),

    resetState: () =>
      set({
        selectedShift: null,
        isEdit: false,
        isOpen: false,
        isLoading: false,
      }),

    setEditShift: (shift) =>
      set({
        selectedShift: shift,
        isEdit: Boolean(shift),
        isOpen: true,
      }),

    /* ================= LOAD ================= */

    loadShifts: async () => {
      set({ isLoading: true });

      try {
        const response = await axios.get(
          `/api/shifts`
        );

        set({
          shifts: response.data.data || [],
        });
      } catch (error) {
        set({ shifts: [] });
      } finally {
        set({ isLoading: false });
      }
    },

    /* ================= ADD ================= */

    addShift: async (data) => {
      set({ isLoading: true });

      try {
        const res = await axios.post(
          `/api/shifts`,
          data,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        if (res.data.success) {
          get().loadShifts();
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

    updateShift: async (id, data) => {
      set({ isLoading: true });

      try {
        const res = await axios.put(
          `/api/shifts/${id}`,
          data,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        if (res.data.success) {
          get().loadShifts();
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

    deleteShift: async (id: string) => {
      set({ isLoading: true });

      const toDelete = get().shifts.find(
        (r) => r.id === id
      );

      if (!toDelete) {
        set({ isLoading: false });

        return {
          success: false,
          message: "Shift not found",
        };
      }

      try {
        const res = await axios.delete(`/api/shifts/${id}`);

        if (res.data.success) {
          get().loadShifts();
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

    getShiftById: (id) =>
      get().shifts.find(
        (shift) => shift.id === id
      ),
  })
);