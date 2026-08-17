import { create } from "zustand";
import axios from "axios";

/* =========================
   STATE TYPE
========================= */

interface AccessRouteDepartments {
    id?: string
    frontendRouteIds: string[]
    subitemFrontendRouteIds?: string[]
}

interface AccessRouteDepartmentsStore {
    /* DATA */
    accessRouteDepartments: AccessRouteDepartments[];
    accessRoutes: any;

    /* PAGINATION */
    page: number;
    idDelete: string;
    isDelete: boolean;
    totalPages: number;

    setAccessRouteDepartment: (data: AccessRouteDepartments[]) => void;
    setPagination: (page: number, totalPages: number) => void;

    selectedAccessRouteDepartment: AccessRouteDepartments | any | null;
    isOpen: boolean;
    isEdit: boolean;
    isLoading: boolean;

    openModal: () => void;
    closeModal: () => void;
    closeModalDelete: () => void;
    resetState: () => void;
    setIdDelete: (id: string) => void;

    /* DATA ACTIONS */
    loadAccessRouteDepartments: () => Promise<void>;
    loadAccessRoutes: () => Promise<void>;
    addAccessRouteDepartment: (data: AccessRouteDepartments) => Promise<{ success: boolean; message: string; id: string }>;
    updateAccessRouteDepartment: (id: string, data: AccessRouteDepartments) => Promise<{ success: boolean; message: string; id: string }>;
    deleteAccessRouteDepartment: (id: string) => Promise<{ success: boolean; message: string }>;

    getAccessRouteDepartmentById: (id: string) => AccessRouteDepartments | undefined;
}

export const useAccessRouteDepartmentStore = create<AccessRouteDepartmentsStore>((set, get) => ({
    accessRouteDepartments: [],
    accessRoutes: [],
    selectedAccessRouteDepartment: null,
    selectedAccessRouteDepartments: null,
    isOpen: false,
    isEdit: false,
    isLoading: false,
    page: 1,
    totalPages: 1,
    idDelete: "",
    isDelete: false,

    setIdDelete: (id) => set({ idDelete: id, isDelete: true }),
    closeModalDelete: () => set({ isDelete: false, idDelete: "" }),

    setAccessRouteDepartment: (data) => set({ accessRouteDepartments: data }),
    setPagination: (page, totalPages) => set({ page, totalPages }),

    /* UI */
    openModal: () => set({ isOpen: true }),
    closeModal: () =>
        set({
            isOpen: false,
            selectedAccessRouteDepartment: null,
            isEdit: false,
            isDelete: false,
            idDelete: "",
        }),
    resetState: () =>
        set({
            selectedAccessRouteDepartment: null,
            isEdit: false,
            isOpen: false,
            isLoading: false,
        }),
    loadAccessRouteDepartments: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/access-routes/frontend-route`);
            set({ accessRoutes: response.data.data || [] });
        } catch (error) {
            set({ accessRoutes: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    loadAccessRoutes: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/access-routes/frontend-route`);
            set({ accessRoutes: response.data.data || [] });
        } catch (error) {
            set({ accessRoutes: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    addAccessRouteDepartment: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`/api/access-routes`, data, {
                headers: { "Content-Type": "application/json" },
            });
            if (res.data.success) await get().loadAccessRouteDepartments();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },

    updateAccessRouteDepartment: async (id, data) => {
        console.log("Updating AccessRouteDepartment with ID:", id, "and data:", data);
        set({ isLoading: true });
        try {
            const res = await axios.put(`/api/access-routes/department/${id}`, data, {
                headers: { "Content-Type": "application/json" },
            });
            if (res.data.success) await get().loadAccessRouteDepartments();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAccessRouteDepartment: async (id) => {
        set({ isLoading: true });
        const item = get().accessRouteDepartments.find(r => r.id === id);
        if (!item) {
            set({ isLoading: false });
            return { success: false, message: "AccessRouteDepartment not found" };
        }
        try {
            const res = await axios.delete(`/api/access-routes/${id}`);
            if (res.data.success) await get().loadAccessRouteDepartments();
            return { success: res.data.success, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error" };
        } finally {
            set({ isLoading: false });
        }
    },

    getAccessRouteDepartmentById: (id) => {
        return get().accessRouteDepartments.find(r => r.id === id);
    },
}));