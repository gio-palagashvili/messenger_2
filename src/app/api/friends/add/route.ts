import { authOptions } from "@/lib/authOptions";
import { validateFriend } from "@/lib/validators/addFriend.zod";
import { getServerSession } from "next-auth";
import { NextApiResponse } from 'next';
import { fetchRedis } from "@/app/helpers/redis";
import { db } from "@/lib/db";
import { handleError } from "@/app/helpers/errorHanlder";


export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        console.log("inside try");
        const sess = await getServerSession(authOptions);
        if (!sess) return res.status(401).json({ message: "not authorized" })

        const body = await req.json();
        const { email } = validateFriend.parse({ email: body.email });


        const user = await fetchRedis("get", `user:email:${email}`);

        if (!user) return new Response("no user founnd", { status: 200 });

        if (user === sess.user.id) return new Response("can't add urself as a friend", { status: 400 });

        const alrSent = await fetchRedis("sismember", `user:${user}:friend_requests`, sess.user.id) as 0 | 1;
        const alrAdded = await fetchRedis("sismember", `user:${user}:friends`, sess.user.id) as 0 | 1;

        if (alrSent) return new Response("already sent", { status: 200 });
        if (alrAdded) return new Response("already added", { status: 200 })
        console.log(user.result);

        db.sadd(`user:${user.result}:friend_requests`, sess.user.id)

        return new Response("email", { status: 200 })
    } catch (error) {
        console.log(error + "}}}}}}}}}");
        handleError(error)
    }
}