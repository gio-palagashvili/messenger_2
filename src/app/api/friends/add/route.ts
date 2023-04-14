import { authOptions } from "@/lib/authOptions";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import { getServerSession } from "next-auth";
import { NextApiResponse } from 'next';
import { fetchRedis } from "@/app/helpers/redis";
import { db } from "@/lib/db";
import { handleError } from "@/app/helpers/errorHanlder";


export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const sess = await getServerSession(authOptions);
        if (!sess) return res.status(401).json({ message: "not authorized" })

        const body = await req.json();
        const { email } = validateFriend.parse(body.email);

        const user = await fetchRedis("get", `user:email${email}}`);

        const data = await user.json() as { result: string | null };

        if (data.result) return res.status(400).json({ message: "no user found" })
        if (data.result === sess.user.email) return res.status(200).json({ message: "u cant add urslef as a friend" })

        const alrSent = await fetchRedis("sismember", `user:${data.result}:friend_requests`, sess.user.id) as 0 | 1;
        const alrAdded = await fetchRedis("sismember", `user:${data.result}:friends`, sess.user.id) as 0 | 1;

        if (alrSent == 0) return res.status(400).json({ message: "already sent" });
        if (alrAdded == 0) return res.status(400).json({ message: "already friends" });

        db.sadd(`user:${data.result}:friend_requests`, sess.user.id)

        return res.status(200);
    } catch (error) {
        return handleError(error);
    }
}