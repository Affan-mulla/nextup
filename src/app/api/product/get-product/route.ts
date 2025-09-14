import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req  : NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search");
    console.log(search);
    
    if(search) {
      const products = await prisma.companies.findMany({
        where: {
          name: {
            contains : search,
            mode: "insensitive"
          }
        },
        select: {
          id: true,
          name: true,
          logoUrl: true
        },
       
      })
      
      if (!products) {
        return NextResponse.json(
          { error: "Products not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(products, { status: 200 });

    }


    const products = await prisma.companies.findMany({
      select: {
        id: true,
        name: true,
        logoUrl: true,
      },
    });

    if (!products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
