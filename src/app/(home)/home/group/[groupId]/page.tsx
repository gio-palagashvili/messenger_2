import { fetchRedis, getUsersById } from "@/app/helpers/redis";
import ChatInput from "@/components/chat/ChatInput";
import GroupMessages from "@/components/messages/GroupMessages";
import Messages from "@/components/messages/Messages";
import ChatHeader from "@/components/ui/ChatHeader";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface pageProps {
  params: {
    groupId: string;
  };
}

const page = async ({ params }: pageProps) => {
  const { groupId } = params;

  const sess = await getServerSession(authOptions);
  if (!sess) redirect("/login");
  const isApart = (await fetchRedis(
    "smembers",
    `user:${sess.user.id}:groups`
  )) as string[];
  if (!isApart.includes(groupId)) {
    redirect("/home");
  }

  const res: string[] = await fetchRedis(
    "zrange",
    `group:${groupId}:messages`,
    0,
    -1
  );

  const messages: GroupMessage[] = res
    .map((m) => {
      return JSON.parse(m) as GroupMessage;
    })
    .reverse();

  const groupRaw = JSON.parse(
    await fetchRedis("smembers", `group:${groupId}`)
  ) as Group;

  const groupMembersData: string[] = (
    await getUsersById(groupRaw.members, false)
  ).map((u) => {
    return JSON.stringify(u);
  });

  return (
    <div className="w-full h-full flex">
      <div className="w-full lg:w-[70%] h-full">
        <ChatHeader
          groupDetails={{
            name: groupRaw.name,
            members: groupMembersData,
            image: groupRaw.image,
          }}
        />
        <div className="divider mt-0 mb-0 h-1"></div>
        <GroupMessages
          initialMessages={messages}
          sessionId={sess.user.id}
          chatId={groupId}
        />
        <ChatInput chatId={groupId} isGroup={true} />
      </div>
    </div>
  );
};

export default page;
