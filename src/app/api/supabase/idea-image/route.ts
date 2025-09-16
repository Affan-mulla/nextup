import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const req = await request.json()

        req.images.map((image: any) => {
            supabase.storage.from("idea_images").upload(image.name, image.file, {
                cacheControl: '3600',
                upsert: false
            })
        })

    } catch (error) {
        return new Response("Error creating idea", {status: 501})
    }
}