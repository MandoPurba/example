import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import axios from "axios";
import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL


export const GET = auth(async (...args: [any, { params: any; }]) => {

    const [req, { params }] = args

    const { userId } = await params;

    try {
        // const sessionId = req.auth?.user?.id
        const token = req.auth?.accessToken
        // if (!sessionId) {
        //     return NextResponse.json(
        //         { success: false, message: "Missing session" },
        //         { status: 401 }
        //     );
        // }

        const response = await axios.get(
            `${NEXT_PUBLIC_API_URL}/attendances/user/${encodeURIComponent(userId)}`,
        );

        return NextResponse.json(response.data);
    } catch (err: any) {
        console.error("Server error:", err?.response?.data || err);
        return NextResponse.json(
            { success: false, message: err?.response?.data.message || "Server error" },
            { status: 500 }
        );
    }
})

export const PUT = auth(async (...args: [any, { params: any; }]) => {

    const [req, { params }] = args

    const { userId } = await params;

    try {
        // const sessionId = req.auth?.user?.id
        // if (!sessionId) {
        //     return NextResponse.json(
        //         { success: false, message: "Missing session" },
        //         { status: 401 }
        //     );
        // }

                const cookieStore = cookies();
        const token = (await cookieStore).get("face_auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token expired or not found" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const response = await axios.put(
            `${NEXT_PUBLIC_API_URL}/attendances/user/${encodeURIComponent(userId)}`,
            body,
                {
                headers: {
                    "Content-Type": "application/json",
                    "x-face-token": token,
                }
            }
        );

        return NextResponse.json(response.data);
    } catch (err: any) {
        console.error("Server error:", err?.response?.data || err);
        return NextResponse.json(
            { success: false, message: err?.response?.data.message || "Server error" },
            { status: 500 }
        );
    }
})

export const DELETE = auth(async (...args: [any, { params: any; }]) => {

    const [req, { params }] = args
    const { userId } = await params;

    try {
        // const sessionId = req.auth?.user?.id
        const token = req.auth?.accessToken
        // if (!sessionId) {
        //     return NextResponse.json(
        //         { success: false, message: "Missing session" },
        //         { status: 401 }
        //     );
        // }

        const response = await axios.delete(
            `${NEXT_PUBLIC_API_URL}/attendances/user/${encodeURIComponent(userId)}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return NextResponse.json(response.data);
    } catch (err: any) {
        console.error("Server error:", err?.response?.data || err);
        return NextResponse.json(
            { success: false, message: err?.response?.data.message || "Server error" },
            { status: 500 }
        );
    }
})