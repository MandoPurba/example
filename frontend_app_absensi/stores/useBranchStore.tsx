import { create } from "zustand";
import axios from "axios";
import { Branch } from "@/types";

/* =========================
   STATE TYPE
========================= */

interface BranchStore {
    /* DATA */
    branches: Branch[];

    /* PAGINATION */
    page: number;
    idDelete: string;
    isDelete: boolean;
    totalPages: number;
    setBranches: (data: Branch[]) => void;
    setPagination: (page: number, totalPages: number) => void;

    /* UI STATE */
    selectedBranch: Branch | null;
    isOpen: boolean;
    isEdit: boolean;
    isLoading: boolean;

    /* UI ACTIONS */
    openModal: () => void;
    closeModal: () => void;
    closeModalDelete: () => void;
    resetState: () => void;
    setIdDelete: (id: string) => void;

    /* DATA ACTIONS */
    setEditBranch: (branch: Branch | null) => void;
    loadBranches: () => Promise<void>;
    addBranch: (data: Branch) => Promise<{ success: boolean; message: string; id: string }>;
    updateBranch: (id: string, data: Branch) => Promise<{ success: boolean; message: string; id: string }>;
    deleteBranch: (
        id: string,
        allowUndo?: boolean
    ) => Promise<{ success: boolean; message: string }>;

    getBranchById: (id: string) => Branch | undefined;
    getBranchByUserId: (userId: string) => void;
}


export const useBranchStore = create<BranchStore>((set, get) => ({
    branches: [],

    selectedBranch: null,
    isOpen: false,
    isEdit: false,
    isLoading: false,
    page: 1,
    totalPages: 1,
    idDelete: "",
    isDelete: false,
    setIdDelete: (id) => set({ idDelete: id, isDelete: true }),
    closeModalDelete: () =>
        set({
            isDelete: false,
            idDelete: ""
        }),
    setBranches: (data) => set({ branches: data }),

    setPagination: (page, totalPages) => set({ page, totalPages }),
    /* ================= UI ================= */

    openModal: () => set({ isOpen: true }),

    closeModal: () =>
        set({
            isOpen: false,
            selectedBranch: null,
            isEdit: false,
            isDelete: false,
            idDelete: ""
        }),
    resetState: () =>
        set({
            selectedBranch: null,
            isEdit: false,
            isOpen: false,
            isLoading: false,
        }),

    setEditBranch: (branch) =>
        set({
            selectedBranch: branch,
            isEdit: Boolean(branch),
            isOpen: true,
        }),

    loadBranches: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/branches`);
            set({ branches: response.data.data || [] });
        } catch (error) {
            console.error("Error loading branches:", error);
            set({ branches: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    /* ================= ADD ================= */

    /* ADD USER */
    addBranch: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`/api/branches`, data, {
                headers: { "Content-Type": "application/json" },
            });
            if (res.data.success) get().loadBranches();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },

    updateBranch: async (id, data) => {
        set({ isLoading: true });
        try {
            const res = await axios.put(
                `/api/branches/${id}`,
                data,
                { headers: { "Content-Type": "application/json" }, }
            );
            if (res.data.success) get().loadBranches();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },
    deleteBranch: async (id: string) => {
        set({ isLoading: true });
        const userToDelete = get().branches.find(r => r.id === id);

        if (!userToDelete) {
            set({ isLoading: false });
            return { success: false, message: "Branch not found" };
        }

        try {
            const res = await axios.delete(`/api/branches/${id}`);
            if (res.data.success) get().loadBranches();
            return { success: res.data.success, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error" };
        } finally {
            set({ isLoading: false });
        }
    },


    /* ================= GET ================= */

    getBranchByUserId: async (userId) => {
        try {
            const res = await axios.get(`/api/branches/user/${encodeURIComponent(userId)}`);
            set({ branches: res.data.data.branches });
        } catch (error) {
            set({ branches: [] });
        } finally {
        }
    },

    getBranchById: (id) =>
        get().branches.find((b) => b.id === id),

}));