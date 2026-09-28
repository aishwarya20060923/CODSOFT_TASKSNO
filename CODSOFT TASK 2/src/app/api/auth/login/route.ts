import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In demo / educational app, check password or accept demo default
    if (password && user.password && user.password !== password && password !== "password123") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: error.message || "Failed to log in" }, { status: 500 });
  }
}
