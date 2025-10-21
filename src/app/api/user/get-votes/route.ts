import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET /api/user/get-votes?username=...&type=UP|DOWN
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const type = searchParams.get("type"); // "UP" or "DOWN"

    if (!username || !type || (type !== "UP" && type !== "DOWN")) {
      return new Response(JSON.stringify({ error: "Missing or invalid params" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    // Server-side guard: only the owner can view their votes
    const session = await getSession();
    const sessionUserId = session?.user?.id as string | undefined;
    if (!sessionUserId || sessionUserId !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // Find all ideas the user has voted on with the given type
    const votes = await prisma.votes.findMany({
      where: { userId: user.id, type },
      select: {
        idea: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            votesCount: true,
            author: { select: { id: true, name: true, image: true, username: true } },
            company: { select: { id: true, name: true, logoUrl: true } },
            _count: { select: { comments: true } },
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Flatten to just the idea objects
    const ideas = votes.map((v) => v.idea);
    return new Response(JSON.stringify(ideas), { status: 200 });
  } catch (error) {
    console.error("GET /api/user/get-votes error", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
