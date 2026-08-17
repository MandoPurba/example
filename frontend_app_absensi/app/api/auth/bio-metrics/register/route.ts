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

        const backendResponse = await fetch(`${API_URL}/face-recognitions/register`, {
            method: "POST",
            body: formData,
        });

        const data = await backendResponse.json();

        return NextResponse.json({
            success: true,
            result: data,
        });
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
});