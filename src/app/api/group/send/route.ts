import { handleError } from '@/app/helpers/errorHanlder';
import { fetchRedis, getUserGroups } from '@/app/helpers/redis';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { pusherKey } from '@/lib/utils';
import { groupMessageValidator } from '@/lib/validators/messages.zod';
import { nanoid } from 'nanoid';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';


export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new Response("", { status: 401 });

        const body = await req.json();
        const { chatId, text } = body;
        const userGroups = await getUserGroups(session.user.id, false);

        if (!userGroups.includes(chatId)) return new Response("not part of the group", { status: 400 })
        if (text.length < 1 || text.length > 999) return new Response("text invalid", { status: 400 })

        const time = Date.now();

        const message: GroupMessage = {
            id: nanoid(),
            // @ts-expect-error
            sender: session.user,
            text: text,
            timestamp: time
        }
        groupMessageValidator.parse(message);

        await db.zadd(`group:${chatId}:messages`, {
            score: time,
            member: JSON.stringify(message)
        });

        pusherServer.trigger(pusherKey(`group:${chatId}:group_message`), "new_message", message);

        return new Response('', { status: 200 })
    } catch (error) {
        handleError(error)
    }
}