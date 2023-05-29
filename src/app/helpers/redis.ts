const getENV = () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || url.length == 0) console.log("check ENV file (url)")
    if (!token || token.length == 0) console.log("check ENV file (token)")

    return { token, url }
}

type Command = 'zrange' | 'sismember' | 'get' | 'smembers' | 'exists';

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
            const sender: User = JSON.parse(await fetchRedis("get", `user:${id}`) as string) as User
            return useSender ? { senderId: sender.id, senderEmail: sender.email, image: sender.image, name: sender.name } : sender
        })
    )
    return res;
}
export const getUserFriendsById = async (user: string, includeChatList: boolean = true) => {
    const friendIds = await fetchRedis('smembers', `user:${user}:friends`) as string[];
    const friendsData = await getUsersById(friendIds, false) as User[];

    const data: ChatList[] = await Promise.all(friendsData.map(async (friend) => {
        const chatId = [user, friend.id].sort().join("--")

        if (await fetchRedis("exists", `chat:${chatId}:messages`)) {
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
        }
        return {
            email: friend.email,
            id: friend.id,
            image: friend.image,
            name: friend.name,
            text: `you can now text ${friend.name}`,
            timestamp: 0
        }
    }))

    return includeChatList ? data : friendsData;
}
export const getUserGroups = async (userId: string, forwardLatest: boolean = true): Promise<GroupListItem[] | string[]> => {
    const getGroupIds: string[] = await fetchRedis("smembers", `user:${userId}:groups`);
    if (getGroupIds.length === 0) {
        return [];
    }

    const groupMessages: GroupListItem[] | Group[] = await Promise.all(getGroupIds.map(async group => {
        let latestMessage: GroupMessage;
        const groupData: Group = JSON.parse(await fetchRedis("smembers", `group:${group}`)) as Group;

        if (!await fetchRedis("exists", `group:${group}:messages`)) {
            const data: GroupListItem = {
                groupId: group,
                name: groupData.name,
                latestMessage: 'start your chat',
                senderName: '',
                timestamp: 0,
                image: groupData.image
            }
            return data;
        }

        latestMessage = JSON.parse(await fetchRedis("zrange", `group:${group}:messages`, -1, -1)) as GroupMessage;

        const data: GroupListItem = {
            groupId: group,
            name: groupData.name,
            latestMessage: latestMessage.text,
            senderName: latestMessage.sender.name,
            timestamp: latestMessage.timestamp,
            image: groupData.image
        }

        return data;
    }))

    return forwardLatest ? groupMessages : getGroupIds;
}