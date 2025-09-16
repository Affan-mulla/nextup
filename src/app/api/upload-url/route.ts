import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth"; // if you're using next-auth

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key (⚠️ server only!)
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName } = body;

    // 1. Get user session (to know userId)
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // 3. Generate a signed upload URL
    const { data, error } = await supabase.storage
      .from("idea_images") // your bucket name
      .createSignedUploadUrl(fileName);

    if (error) throw error;

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: fileName,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
