import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to check authorization
async function checkAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// Helper function to generate signed URL for idea image upload
async function generateIdeaImageUrl(userId: string, fileName: string) {
  const timestamp = new Date().getTime();
  const path = `${userId}/${timestamp}_${fileName}`;
  
  // Generate new signed URL
  const { data, error } = await supabase.storage
    .from("idea_images")
    .createSignedUploadUrl(path);

  if (error) throw error;
  return { signedUrl: data.signedUrl, path };
}

export async function POST(req: Request) {
  try {
    // Check auth
    const user = await checkAuth();

    // Get file name from request
    const body = await req.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    // Generate signed URL for idea image upload
    const { signedUrl, path } = await generateIdeaImageUrl(user.id, fileName);

    return NextResponse.json({
      signedUrl,
      path,
      publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/idea_images/${path}`
    });
  } catch (error: any) {
    console.error("[IDEA-IMAGE-UPLOAD]", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate upload URL" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}