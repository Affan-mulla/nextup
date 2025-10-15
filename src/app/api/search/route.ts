import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    let  popular = await prisma.companies.findMany({
      take: 5,
    //   orderBy: { searches: "desc" },
      select: { id: true, name: true },
    });

    popular = popular.map((company) => ({ ...company, type: "Companies" }));

    let popularUsers = await prisma.user.findMany({
      where :{
        companies : {
          none :{}
        }
      },  
      take: 5,
    //   orderBy: { followers: "desc" },
      select: { id: true, name: true },
    });

    popularUsers = popularUsers.map((user) => ({ ...user, type: "Users" }));

    
    return NextResponse.json([...popular, ...popularUsers]);
  }

  let companies = await prisma.companies.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    select: { id: true, name: true },
  });

  let users = await prisma.user.findMany({
    where: { name: { contains: q, mode: "insensitive" },companies : {none :{}} },
    select: { id: true, name: true },
  });

  companies = companies.map((company) => ({ ...company, type: "Companies" }));
  users = users.map((user) => ({ ...user, type: "Users" }));

  return NextResponse.json([...companies, ...users]);
}
