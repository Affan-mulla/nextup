"use server";

import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function  Home() {
  const session = await auth() as Session | null;
  console.log(session);
  
  if(!session  ) {
    redirect("/feed")
  }
  if(session) {
    if(session.user.role === "ADMIN") return redirect("/dashboard/company")
    if(session.user.role === "USER") return redirect("/feed")
  }
  redirect("/feed")
}
