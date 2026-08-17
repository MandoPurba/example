// app/api/auth/bio-metrics/verify/check/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // <--- ini

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("face_auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token expired or not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}