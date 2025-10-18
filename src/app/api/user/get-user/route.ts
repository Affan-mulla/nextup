import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return new Response(JSON.stringify({ error: "Missing username" }), { status: 400 });
        }

        // Select only the fields needed by the frontend to keep the payload small
        const data = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                name: true,
                image: true,
                createdAt: true,
            },
        });

        if (!data) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("GET /api/user/get-user error", error);
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
    }
}