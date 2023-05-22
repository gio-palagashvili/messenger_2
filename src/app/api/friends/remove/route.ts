import { handleError } from '@/app/helpers/errorHanlder';
import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { chatIdConstructor } from '@/lib/utils';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const sess = await getServerSession(authOptions);
        if (!sess) return res.status(401).json({ message: "not authorized" })

        const body = await req.json();
        const { id } = body;

        if (!id) return new Response("invalid id", { status: 400 });
        if (!await fetchRedis("get", `user:${id}`)) return new Response("No user found", { status: 404 });

        db.del(`chat:${chatIdConstructor(sess.user.id, id)}:messages`);
        db.srem(`user:${sess.user.id}:friends`, id);
        db.srem(`user:${id}:friends`, sess.user.id);

        return new Response("", { status: 200 })
    } catch (error) {
        handleError(error);
    }
}