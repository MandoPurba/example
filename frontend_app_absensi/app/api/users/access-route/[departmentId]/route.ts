import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import axios from "axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL


export const GET = auth(async (...args: [any, { params: any; }]) => {

    const [req, { params }] = args
    const { departmentId } = await params;

    console.log("Fetching Access Route for Department ID:", departmentId);
    try {
        // const sessionId = req.auth?.user?.id
        const token = req.auth?.accessToken
        // if (!sessionId) {
        //     return NextResponse.json(
        //         { success: false, message: "Missing session" },
        //         { status: 401 }
        //     );
        // }

        const isAccessRouteControl =
            req.nextUrl.searchParams.get("is_access_route_control");
console.log("is_access_route_control:", isAccessRouteControl);
        const queryParams = new URLSearchParams({
            department_id: departmentId,
            user_id: req.auth?.user?.id || "",
            is_access_route_control: String(isAccessRouteControl) || "false",
        });

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/access-routes/department?${queryParams.toString()}`
        );


        return NextResponse.json(response.data);
    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err?.response?.data.message || "Server error" },
            { status: 500 }
        );
    }
})