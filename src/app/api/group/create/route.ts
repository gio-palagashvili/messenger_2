import { handleError } from '@/app/helpers/errorHanlder';
import { getUserFriendsById, getUsersById } from '@/app/helpers/redis';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { pusherKey } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

interface BodyType {
    groupName: string;
    selectedFriends: ChatList[];
}

export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new Response("", { status: 401 });

        const body = await req.json();
        const { groupName, selectedFriends }: BodyType = body;

        if (groupName?.length === 0) {
            return new Response("name too short", { status: 400 })
        }
        if (selectedFriends.length == 0) {
            return new Response("Invalid friend list", { status: 400 })
        }

        const userFriends = (await getUserFriendsById(session.user.id, false));
        const areFriends = selectedFriends.map(friend => {
            if (!userFriends.includes(friend)) {
                return false;
            }
        })
        if (!areFriends) return new Response("can't add non-friends to a group", { status: 400 });

        const id = nanoid();
        const members = userFriends.map(friend => {
            return friend.id
        });
        members.push(session.user.id);

        await db.sadd(`group:${id}`, JSON.stringify({
            "name": groupName, "members": members, "image": "https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg"
        }));

        const groupData: GroupListItem = {
            name: groupName,
            groupId: id,
            image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg",
            latestMessage: "write a message to this group",
            senderId: "1",
            timestamp: 0
        }
        await Promise.all(userFriends.map(async (friend) => {
            pusherServer.trigger(pusherKey(`user:newGroup:${friend.id}`), "added_to_group", groupData)
            db.sadd(`user:${friend.id}:groups`, id);
        }))

        pusherServer.trigger(pusherKey(`user:newGroup:${session.user.id}`), "added_to_group", groupData)


        await db.sadd(`user:${session.user.id}:groups`, id);

        return new Response("", { status: 200 })
    } catch (error) {
        handleError(error)
    }
}