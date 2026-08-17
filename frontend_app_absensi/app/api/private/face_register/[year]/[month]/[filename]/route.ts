import { NextResponse } from "next/server";
import axiosInstance from "@/utils/axiosInstance";
import { auth } from "@/libs/auth";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
export const GET = auth(async (...args: [any, { params: any }]) => {
  const [req, { params }] = args;

  try {
    const sessionId = req.auth?.user?.id;
    const token = req.auth?.accessToken

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Missing session" },
        { status: 401 }
      );
    }

    const { year, month, filename } = await params;

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}/files/private/face_register/${year}/${month}/${filename}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        responseType: "arraybuffer", // penting untuk file
      }
    );

    const rawContentType = response.headers["content-type"];
    const contentType = Array.isArray(rawContentType)
      ? rawContentType[0]
      : String(rawContentType || "application/octet-stream");

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });

  } catch (err: any) {
    console.error("Server error:", err?.response?.data || err);
    return NextResponse.json(
      { success: false, message: err?.response?.data?.message || "Server error" },
      { status: 500 }
    );
  }
});