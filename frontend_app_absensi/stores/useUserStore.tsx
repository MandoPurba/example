import { create } from "zustand";
import { UserInput } from "@/schemas/userSchema";
import axios from "axios";

/* =========================
   USER TYPE
========================= */


export interface User extends UserInput {
    id?: string;

    phone?: string;

    address?: {
        country?: string;
        city?: string;
        postalCode?: string;
        taxId?: string;
    };

    user_profile: {
        name?: string;
        email: string;
        status?: "Active" | "Non-Active";
        image?: string;
        phone?: string;
        department_id?: string;
    };
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };

    createdAt?: string;
    updatedAt?: string;
}

/* =========================
   STORE TYPE
========================= */
interface UserStore {
    users: User[];

    selectedUser: User | null;
    isEdit: boolean;
    isOpen: boolean;
    isLoading: boolean;
    selectedAccessRouteDepartments: any | null;
    getAccessRouteByDepartmentId: (id: string) => Promise<void>;
    setIsLoading: (loading: boolean) => void;
    openModal: () => void;
    closeModal: () => void;
    loadUsers: () => Promise<void>;
    addUser: (data: User) => Promise<{ success: boolean; message: string; id: string }>;
    updateUser: (id: string, data: User) => Promise<{ success: boolean; message: string; id: string }>;
    deleteUser: (
        id: string,
        allowUndo?: boolean
    ) => Promise<{ success: boolean; message: string }>;
    setEditUser: (id: string | null) => void;
    getUserById: (id: string) => Promise<void>;
}

/* =========================
   STORE
========================= */
export const useUserStore = create<UserStore>((set, get) => ({
    users: [],

    selectedUser: null,
    isEdit: false,
    isOpen: false,
    isLoading: false,
    selectedAccessRouteDepartments: null,
    setIsLoading: (loading) => set({ isLoading: loading }),
    /* MODAL */
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
    loadUsers: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/users`);
            set({ users: response.data.data || [] });
        } catch (error) {
            set({ users: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    setEditUser: async (id) => {
        if (!id) {
            set({ isEdit: false, selectedUser: null });
            return;
        }
        await get().getUserById(id);

        set({ isEdit: true });
    },
    /* ADD USER */
    addUser: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`/api/users`, data, {
                headers: { "Content-Type": "application/json" },
            });
            if (res.data.success) get().loadUsers();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },

    updateUser: async (id, data) => {
        set({ isLoading: true });
        try {
            const res = await axios.put(
                `/api/users/${id}`,
                data,
                { headers: { "Content-Type": "application/json" }, }
            );
            if (res.data.success) get().loadUsers();
            return { success: res.data.success, message: res.data.message, id: res.data.id };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error", id: "" };
        } finally {
            set({ isLoading: false });
        }
    },
    deleteUser: async (id: string) => {
        set({ isLoading: true });
        const userToDelete = get().users.find(r => r.id === id);

        if (!userToDelete) {
            set({ isLoading: false });
            return { success: false, message: "User not found" };
        }

        try {
            const res = await axios.delete(`/api/users/${id}`);
            if (res.data.success) get().loadUsers();
            return { success: res.data.success, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || error?.message || "Unknown error" };
        } finally {
            set({ isLoading: false });
        }
    },
    getUserById: async (id) => {
        try {
            const res = await axios.get(`/api/users/${encodeURIComponent(id)}`);
            set({ selectedUser: res.data.data });
        } catch (error) {
            console.error("Failed to load registrants:", error);
            set({ selectedUser: null });
        } finally {
        }
    },

    getAccessRouteByDepartmentId: async (id) => {
        try {
            const res = await axios.get(`/api/users/access-route/${encodeURIComponent(id)}`);
            set({ selectedAccessRouteDepartments: res.data.data });
        } catch (error) {
            console.error("Failed to load Access Route Department:", error);
            set({ selectedAccessRouteDepartments: null });
        } finally {
        }
    },
}));