import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // Accept username for convenience; if userId is provided use it
    const username = searchParams.get("username");
    const userIdParam = searchParams.get("userId");

    if (!username && !userIdParam) {
      return new Response(
        JSON.stringify({ error: "Missing username or userId" }),
        { status: 400 }
      );
    }

    let userId = userIdParam || undefined;

    if (!userId && username) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!user)
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      userId = user.id;
    }

    // Fetch recent posts for the user with necessary related data and counts
    const ideas = await prisma.ideas.findMany({
      where: { userId },
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        votesCount: true,
        votes: {
          where: { userId },
          select: { type: true },
        },
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        company: { select: { id: true, name: true, logoUrl: true } },
        _count: { select: { comments: true } },
      },
    });

    // flatten votes to a simple string (or null if none)
    const formattedIdeas = ideas.map((idea) => ({
      ...idea,
      userVote: idea.votes[0]?.type ?? null, // "UP" | "DOWN" | null
    }));

    return new Response(JSON.stringify(formattedIdeas), { status: 200 });
  } catch (error) {
    console.error("GET /api/user/get-posts error", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
