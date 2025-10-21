import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get update data from request body
    const data = await req.json();
    
    // Validate update data
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;
    

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        username: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[USER-UPDATE]", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}