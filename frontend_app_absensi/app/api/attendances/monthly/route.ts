import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import axios from "axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GET = auth(async (...args: [any, { params: any }]) => {
  const [req] = args;
  try {
    const response = await axios.get(
      `${NEXT_PUBLIC_API_URL}/attendances/monthly${req.nextUrl.search}`
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Server error",
      },
      { status: err?.response?.status || 500 }
    );
  }
});
