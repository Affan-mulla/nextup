import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function  GET(req : NextRequest) {
    try {
        const ideaId = req.nextUrl.searchParams.get("ideaId");
        console.log(ideaId);

        if(!ideaId) {
            return new Response("Missing ideaId", {status: 400})
        }

        const idea = await prisma.ideas.findUnique({
            where : {
                id : ideaId
            },
            select :{
              title : true,
              description : true,
              status : true,
              createdAt : true,
              author :{
                select :{
                  name : true
                }
              },
              id : true,
              company :{
                select :{
                  name : true,
                  logoUrl : true
                }
              }  
            },
            // include :{
            //     company :{
            //         select :{
            //             name : true,
            //             logoUrl : true
            //         }
            //     },
            //     author :{
            //         select :{
            //             name : true
            //         }
            //     },
            // }
        })

        if(!idea) {
            return new Response("Idea not found", {status: 404})
        }

        return new Response(JSON.stringify(idea), {status: 200})
        
    } catch (error) {
        return new Response("Error getting idea", {status: 500})
    }
}