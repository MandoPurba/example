import { create } from "zustand";
import axios from "axios";

/* =========================
   STATE TYPE
========================= */

interface Department {
    id?: string;
    name: string;
    code?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface DepartmentStore {
    /* DATA */
    departments: Department[];

    /* PAGINATION */
    page: number;
    idDelete: string;
    isDelete: boolean;
    totalPages: number;
    setDepartments: (data: Department[]) => void;
    setPagination: (page: number, totalPages: number) => void;

    /* UI STATE */
    selectedDepartment: Department | null;
    selectedAccessRouteDepartments: any | null;
    isOpen: boolean;
    isEdit: boolean;
    isLoading: boolean;

    /* UI ACTIONS */
    openModal: () => void;
    closeModal: () => void;
    closeModalDelete: () => void;
    resetState: () => void;
    setIdDelete: (id: string) => void;
    getAccessRouteByDepartmentId: (id: string) => Promise<void>;

    /* DATA ACTIONS */
    setEditDepartment: (department: Department | null) => void;
    loadDepartments: () => Promise<void>;
    addDepartment: (data: Department) => Promise<{ success: boolean; message: string; id: string }>;
    updateDepartment: (id: string, data: Department) => Promise<{ success: boolean; message: string; id: string }>;
    deleteDepartment: (
        id: string,
        allowUndo?: boolean
    ) => Promise<{ success: boolean; message: string }>;

    getDepartmentById: (id: string) => Department | undefined;
}


export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
    departments: [],

    selectedDepartment: null,
    selectedAccessRouteDepartments: null,
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
    setDepartments: (data) => set({ departments: data }),

    setPagination: (page, totalPages) => set({ page, totalPages }),
    /* ================= UI ================= */

    openModal: () => set({ isOpen: true }),

    closeModal: () =>
        set({
            isOpen: false,
            selectedDepartment: null,
            isEdit: false,
            isDelete: false,
            idDelete: ""
        }),
    resetState: () =>
        set({
            selectedDepartment: null,
            isEdit: false,
            isOpen: false,
            isLoading: false,
        }),

    setEditDepartment: (department) =>
        set({
            selectedDepartment: department,
            isEdit: Boolean(department),
            isOpen: true,
        }),

    loadDepartments: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/departments`);
            set({ departments: response.data.data || [] });
        } catch (error) {
            set({ departments: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    addDepartment: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`/api/departments`, data, {
                headers: { "Content-Type": "application/json" },
            });
            if (res.data.success) get().loadDepartments();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },

    updateDepartment: async (id, data) => {
        set({ isLoading: true });
        try {
            const res = await axios.put(
                `/api/departments/${id}`,
                data,
                { headers: { "Content-Type": "application/json" }, }
            );
            if (res.data.success) get().loadDepartments();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },
    deleteDepartment: async (id: string) => {
        set({ isLoading: true });
        const userToDelete = get().departments.find(r => r.id === id);

        if (!userToDelete) {
            set({ isLoading: false });
            return { success: false, message: "Department not found" };
        }

        try {
            const res = await axios.delete(`/api/departments/${id}`);
            if (res.data.success) get().loadDepartments();
            return { success: res.data.success, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error" };
        } finally {
            set({ isLoading: false });
        }
    },


    getDepartmentById: (id) =>
        get().departments.find((b) => b.id === id),

    getAccessRouteByDepartmentId: async (id) => {
        try {
            const res = await axios.get(`/api/users/access-route/${encodeURIComponent(id)}?is_access_route_control=true`);
            set({ selectedAccessRouteDepartments: res.data.data });
        } catch (error) {
            console.error("Failed to load Access Route Department:", error);
            set({ selectedAccessRouteDepartments: null });
        } finally {
        }
    },
}));