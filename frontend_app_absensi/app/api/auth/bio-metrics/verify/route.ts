// app/api/auth/bio-metrics/verify/route.ts

import { auth } from "@/libs/auth";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const POST = auth(async (...args) => {

    const [req, { params }] = args;
    const userId = req.auth?.user.id;

    try {

        if (!userId) {
            return NextResponse.json({
                success: false,
                status: "MISSING_USER_ID",
                message: "User ID not found in request",
            }, { status: 400 });
        }
        const formData = await req.formData();
        formData.append("userId", String(userId));

        const backendResponse = await fetch(
            `${API_URL}/face-recognitions/verify`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await backendResponse.json();
        const response = NextResponse.json({
            success: true,
            result: data?.data,
        });

        // expired 10 menit
        const maxAge = 60 * 10;

        response.cookies.set("face_auth_token", data?.token || "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge,
        });

        // optional expiry timestamp
        response.cookies.set(
            "face_auth_token_exp",
            String(Date.now() + maxAge * 1000),
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge,
            }
        );
        return response;
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                success: false,
                status: "SERVER_ERROR",
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
)