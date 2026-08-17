import axios from "axios";
import { create } from "zustand";

/* =========================
   TYPE
========================= */

export interface Attendance {
    id?: string;
    userId: string;
    checkIn?: string;
    checkOut?: string;
    latitude_checkIn?: number;
    longitude_checkIn?: number;
    latitude_checkOut?: number;
    longitude_checkOut?: number;
    shift?: any;
    status: "Present" | "Absent" | "Leave" | "Late";
    note?: string;
    faceCheckIns?: [];
    faceCheckOuts?: [];
    createdAt?: string;
    updatedAt?: string;
}

/* =========================
   STORE TYPE
========================= */
interface AttendanceStore {
    attendances: Attendance[];
    selectedAttendanceHistories: [];
    insightAttendance: any;
    attendanceToday: Attendance | null;
    selectedAttendance: Attendance | null;
    isEdit: boolean;
    isOpen: boolean;
    isLoading: boolean;

    setIsLoading: (loading: boolean) => void;

    openModal: () => void;
    closeModal: () => void;

    setEditAttendance: (data: Attendance | null) => void;

    // CRUD
    fetchAttendances: () => Promise<void>;
    addAttendance: (data: FormData, faceToken: string) => Promise<{ success: boolean; message: string, id: string }>;
    updateAttendance: (id: string, data: FormData, faceToken: string) => Promise<{ success: boolean; message: string, id: string }>;
    deleteAttendance: (id: string) => Promise<{ success: boolean; message: string }>;
    getInsightAttendanceByUserId: (userId: string) => Promise<Attendance | null>;
    getAttendanceByUserId: (userId: string) => Promise<Attendance | null>;
    getAttendanceById: (id: string) => Promise<Attendance | null>;
    getAttendanceUserByToday: (userId: string) => Promise<Attendance | null>;
    isAlreadyCheckInToday: (userId: string) => boolean;
}

/* =========================
   STORE
========================= */
export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
    attendances: [],
    insightAttendance: null,
    selectedAttendanceHistories: [],
    attendanceToday: null,
    selectedAttendance: null,
    isEdit: false,
    isOpen: false,
    isLoading: false,

    setIsLoading: (loading) => set({ isLoading: loading }),

    /* MODAL */
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),

    /* EDIT */
    setEditAttendance: (data) =>
        set({
            selectedAttendance: data,
            isEdit: !!data,
        }),

    /* =========================
       GET ALL (NEW)
    ========================= */
    fetchAttendances: async () => {
        set({ isLoading: true });

        try {
            const res = await axios.get(`/api/attendances`);

            set({
                attendances: res.data?.data || [],
            });
        } catch (error) {
            console.error("Fetch attendances error:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    /* =========================
       ADD
    ========================= */
    addAttendance: async (data, faceToken) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(
                `/api/attendances`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-face-token": faceToken,
                    }
                }
            );
            if (res.data.success) {
                set({ attendanceToday: res.data.data });
            }
            return {
                success: res.data.success,
                message: res.data.message,
                id: res.data.data.id
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.error ||
                    error?.message ||
                    "Unknown error",
                id: "",
            };
        } finally {
            set({ isLoading: false });
        }
    },

    /* =========================
       UPDATE (NEW + HIT API)
    ========================= */
    /* =========================
       UPDATE ATTENDANCE STORE FOR CROSSDAY
    ========================= */
    updateAttendance: async (userId: string, data: FormData, faceToken: string) => {
        set({ isLoading: true });
        try {
            const headers: any = { "Content-Type": "application/json" };
            const res = await axios.put(
                `/api/attendances/user/${userId}`,
                data,
                { headers }
            );

            if (res.data.success) {
                set({ attendanceToday: res.data.data });
            }

            return { success: res.data.success, message: res.data.message, id: res.data.data.id };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.error ||
                    error?.message ||
                    "Update failed",
                id: ""
            };
        } finally {
            set({ isLoading: false });
        }
    },

    /* =========================
       DELETE (NEW + HIT API)
    ========================= */
    deleteAttendance: async (id) => {
        set({ isLoading: true });

        try {
            const res = await axios.delete(
                `/api/attendances/${id}`
            );
            if (res.data.success) get().fetchAttendances();
            return { success: true, message: res.data };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.error ||
                    error?.message ||
                    "Delete failed",
            };
        } finally {
            set({ isLoading: false });
        }
    },

    /* =========================
       GET BY ID
    ========================= */
    getAttendanceById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(
                `/api/attendances/${id}`
            );
            set({ selectedAttendance: res.data?.data || null });
            return res.data?.data || null;
        } catch (error) {
            console.error("Get attendance error:", error);
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    getAttendanceByUserId: async (userId) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(
                `/api/attendances/user/${userId}`
            );
            set({ selectedAttendanceHistories: res.data?.data || null });
            return res.data?.data || null;
        } catch (error) {
            console.error("Get attendance error:", error);
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

        getInsightAttendanceByUserId: async (userId) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(
                `/api/attendances/user/insight/${userId}`
            );
            set({ insightAttendance: res.data?.data || null });
            return res.data?.data || null;
        } catch (error) {
            console.error("Get attendance error:", error);
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    /* =========================
       GET TODAY USER
    ========================= */
    getAttendanceUserByToday: async (userId) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(
                `/api/attendances/today/${userId}`
            );
            set({ attendanceToday: res.data?.data || null });
            return res.data?.data || null;
        } catch (error) {
            console.error("Get attendance error:", error);
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    /* =========================
       CHECK LOCAL STATE
    ========================= */
    isAlreadyCheckInToday: (userId) => {
        const today = new Date().toISOString().split("T")[0];

        return get().attendances.some(
            (a) =>
                a.userId === userId &&
                a.createdAt?.split("T")[0] === today &&
                !!a.checkIn
        );
    },
}));