import { handleError } from '@/app/helpers/errorHanlder';
import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/authOptions';
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

        if (!areFriends) return new Response("", { status: 404 });

    } catch (error) {
        handleError(error);
    }
}