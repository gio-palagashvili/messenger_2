import { authOptions } from "@/lib/authOptions";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import { getServerSession } from "next-auth";
import { NextApiResponse } from 'next';
import { fetchRedis } from "@/app/helpers/redis";
import { db } from "@/lib/db";
import { handleError } from "@/app/helpers/errorHanlder";
import { pusherServer } from "@/lib/pusher";
import { pusherKey } from "@/lib/utils";

export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const sess = await getServerSession(authOptions);
        if (!sess) return res.status(401).json({ message: "not authorized" })

        const body = await req.json();
        const { email } = validateFriend.parse({ email: body.email });

        const userId = await fetchRedis("get", `user:email:${email}`);

        if (!userId) return new Response("no user found", { status: 400 });
        if (userId === sess.user.id) return new Response("can't add urself as a friend", { status: 400 });

        const alrSent = await fetchRedis("sismember", `user:${userId}:friend_requests`, sess.user.id) as 0 | 1;
        const alrAdded = await fetchRedis("sismember", `user:${userId}:friends`, sess.user.id) as 0 | 1;

        if (alrSent) return new Response("already sent", { status: 400 });
        if (alrAdded) return new Response("already friends", { status: 400 })

        pusherServer.trigger(pusherKey(`user:${userId}:friend_requests`), 'friend_requests', {
            senderId: sess.user.id,
            senderEmail: sess.user.email,
            image: sess.user.image,
            name: sess.user.name
        });


        db.sadd(`user:${userId}:friend_requests`, sess.user.id)

        return new Response("email", { status: 200 })
    } catch (error) {
        handleError(error)
    }
}