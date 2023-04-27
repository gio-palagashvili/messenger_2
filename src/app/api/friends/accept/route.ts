import { handleError } from "@/app/helpers/errorHanlder";
import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/authOptions";
import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const sess = await getServerSession(authOptions);
        if (!sess) return res.status(401).json({ message: "not authorized" });

        const body = await req.json();
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

        if (await fetchRedis("sismember", `user:${sess.user.id}:friends`, idToAdd)) return new Response('already friends', { status: 400 });
        if (!await fetchRedis("sismember", `user:${sess.user.id}:friend_requests`, idToAdd) as boolean) return new Response('invalid', { status: 400 })

        return new Response("succ", { status: 200 });
    } catch (error) {
        console.log(error);

        handleError(error);
    }
}