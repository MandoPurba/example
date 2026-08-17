import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    /* =======================
       PARSE BODY
    ======================= */
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    /* =======================
       CALL BACKEND AUTH API
    ======================= */
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    const data = response.data;
    const res = NextResponse.json(
      data
    );
    return res;
  } catch (error: any) {
    console.error("Login error:", error?.response?.data || error.message);

    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || "Internal server error",
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}