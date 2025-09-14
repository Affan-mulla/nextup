import prisma from "@/lib/prisma"
import { IdeaData } from "@/lib/validation"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest)   {
    try {
        const req : IdeaData = await request.json()
        console.log(req);
        
        if(!req.title || !req.description || !req.productId || !req.userId) {
            return new Response("Missing fields", {status: 400})
        }

        const res = await prisma.ideas.create({
            data :{
                title : req.title,
                description : req.description,
                companyId : req.productId,
                userId : req.userId,
            }
        })
        if(!res) {
            return new Response("Error creating idea", {status: 500})
        }

        return new Response(JSON.stringify(res), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response("Error creating idea", {status: 501})
    }
}