"use server";

import { getSession } from "@/lib/session";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function  Home() {
  const session : Session | null = await getSession();
  console.log(session);
  
  if(!session  ) {
    redirect("/feed")
  }
  if(session) {
    if(session.user.role === "ADMIN") return redirect("/dashboard/company")
    if(session.user.role === "USER") return redirect("/feed")
  }
}
