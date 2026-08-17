import { auth } from "@/libs/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export const POST = auth(async (...args: [any, { params: any; }]) => {
    const [req, { params }] = args;
    try {
        // const sessionId = req.auth?.user?.id;
        // const token = req.auth?.accessToken

        // if (!sessionId) {
        //     return NextResponse.json(
        //         { success: false, message: "Missing session" },
        //         { status: 401 }
        //     );
        // }

        const body = await req.json();
        const response = await axios.post(
            `${NEXT_PUBLIC_API_URL}/access-routes`,
            body,
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
            { success: false, message: err?.response?.data?.message || "Server error" },
            { status: 500 }
        );
    }
});