import { handleError } from '@/app/helpers/errorHanlder';
import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { pusherKey } from '@/lib/utils';
import { messageValidator } from '@/lib/validators/messages.zod';
import { nanoid } from 'nanoid';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new Response("", { status: 401 });

        const { text, chatId } = await req.json();
        const [userId1, userId2] = chatId.split("--");
        if (session.user.id !== userId1 && session.user.id !== userId2) return new Response("", { status: 401 });

        const chatPartnerId = session.user.id === userId1 ? userId2 : userId1;
        const areFriends = await fetchRedis(
            "sismember",
            `user:${session.user.id}:friends`,
            chatPartnerId
        );
        if (!areFriends) return new Response("", { status: 400 });

        const time = Date.now();
        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text: text,
            timestamp: time,
            recieverId: chatPartnerId
        }
        const message = messageValidator.parse(messageData);

        await db.zadd(`chat:${chatId}:messages`, {
            score: time,
            member: JSON.stringify(message)
        });

        pusherServer.trigger(pusherKey(
            `chat:${chatId}:messages`
        ), 'sent_message', {
            ...message
        });

        // todo? find a better way if there is one
        pusherServer.trigger(pusherKey(`user:${chatPartnerId}:chats`), "unseen_message", {
            ...message,
        })

        pusherServer.trigger(pusherKey(`user:${session.user.id}:sent`), "curr_user_sent", {
            ...message
        })

        return new Response("", { status: 200 })
    } catch (error) {
        handleError(error);
    }
}