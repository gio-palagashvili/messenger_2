import ChatList from "@/components/ChatList";

const getENV = () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || url.length == 0) console.log("check ENV file (url)")
    if (!token || token.length == 0) console.log("check ENV file (token)")

    return { token, url }
}

type Command = 'zrange' | 'sismember' | 'get' | 'smembers';

export const fetchRedis = async (command: Command, ...args: (string | number)[]) => {
    const commUrl = `${getENV().url}/${command}/${args.join("/")}`;

    const res = await fetch(commUrl, {
        headers: {
            Authorization: `Bearer ${getENV().token}`
        }, cache: "no-store"
    });
    if (!res.ok) throw new Error(`redis error ${res.statusText}}`);

    const data = await res.json();

    return data.result;
}
export const getUsersById = async (ids: string[], useSender = true) => {
    const res = await Promise.all(
        ids.map(async (id) => {
            const sender = JSON.parse(await fetchRedis("get", `user:${id}`) as string) as User
            return useSender ? { senderId: sender.id, senderEmail: sender.email, image: sender.image, name: sender.name } : sender
        })
    )
    return res;
}

export const getUserFriendsById = async (user: string, includeLatest: boolean = true) => {
    const friendIds = await fetchRedis('smembers', `user:${user}:friends`) as string[];
    const friendsData = await getUsersById(friendIds, false) as User[];

    const data: ChatList[] = await Promise.all(friendsData.map(async (friend) => {
        const chatId = [user, friend.id].sort().join("--")
        const result: Message = JSON.parse(await fetchRedis(
            "zrange",
            `chat:${chatId}:messages`,
            -1,
            -1
        ) as string) as Message;

        const test: ChatList = {
            email: friend.email,
            id: friend.id,
            image: friend.image,
            name: friend.name,
            text: result.text,
            timestamp: result.timestamp
        }
        return test;
    }))


    return data;
}