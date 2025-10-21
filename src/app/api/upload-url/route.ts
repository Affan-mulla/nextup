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

// Helper function to generate signed URL with upsert
async function generateSignedUrl(bucket: string, fileName: string) {
  // First try to remove existing file if it exists (ignoring any errors)
  await supabase.storage
    .from(bucket)
    .remove([fileName])
    .catch(() => {}); // Ignore any errors if file doesn't exist

  // Now create a new signed URL
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(fileName);

  if (error) throw error;
  return data;
}

export async function POST(req: Request) {
  try {
    // Check auth
    await checkAuth();

    // Get fileName from body
    const body = await req.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    // Determine bucket based on path prefix
    const bucket = fileName.startsWith('avatars/') ? 'avatars' : 'idea_images';
    const data = await generateSignedUrl(bucket, fileName);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: fileName,
    });
  } catch (error: any) {
    console.error("[UPLOAD-URL]", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate upload URL" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Check auth
    await checkAuth();

    // Get fileName from query params
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    // Determine bucket based on path prefix
    const bucket = 'avatars';
    const data = await generateSignedUrl(bucket, fileName);

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      filePath: fileName,
    });
  } catch (error: any) {
    console.error("[UPLOAD-URL]", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate upload URL" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
