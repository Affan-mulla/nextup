import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SettingFormType } from "@/lib/validation";
import { getServerSession } from "next-auth";

export async function PUT(request: Request) {
  try {
    const data : SettingFormType = await request.json();
    
    if(!data.email || !data.username || !data.userId) {
      return new Response("Missing fields", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== data.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.update({
        where: {
            id: data.userId
        },
        data:{
           email: data.email,
           username: data.username,
           name: data.name,
           userJobRole: data.jobRole,
           bio: data.bio
        }
    })

    if(!user) {
      return new Response("Failed to update profile", { status: 500 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
    
  } catch (error) {
    return new Response("Failed to update profile", { status: 500 });
  }
}