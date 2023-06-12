import { handleError } from "@/app/helpers/errorHanlder";
import { fetchRedis, getUsersById } from "@/app/helpers/redis";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { pusherKey } from "@/lib/utils";
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

        await db.srem(`user:${sess.user.id}:friend_requests`, idToAdd);
        await db.sadd(`user:${sess.user.id}:friends`, idToAdd);
        await db.sadd(`user:${idToAdd}:friends`, sess.user.id);

        const id = (await getUsersById([idToAdd], false))[0] as User;
        const dataToSend: ChatList = {
            email: id.email,
            id: id.id,
            image: id.image,
            name: id.name,
            text: `you can now chat with ${id.name}`,
            timestamp: 0,
        }
        console.log(dataToSend);
        pusherServer.trigger(pusherKey(`user:${idToAdd}:friends`), "friend_accepted", {
            ...sess.user,
            text: `you can now chat with ${sess.user.name}`,
        });
        pusherServer.trigger(pusherKey(`user:${sess.user.id}:friends`), "friend_accepted", {
            ...dataToSend
        });
        pusherServer.trigger(pusherKey(`user:${sess.user.id}:friends`), "friend_requests_accept", {})

        return new Response("Added a friend", { status: 200 });
    } catch (error) {
        handleError(error);
    }
}