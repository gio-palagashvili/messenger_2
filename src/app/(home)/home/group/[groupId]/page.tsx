import { fetchRedis, getUsersById } from "@/app/helpers/redis";
import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import ChatHeader from "@/components/ui/ChatHeader";
import { authOptions } from "@/lib/authOptions";
import { errorToast } from "@/lib/customToasts";
import { db } from "@/lib/db";
import { messagesValidator } from "@/lib/validators/messages.zod";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

interface pageProps {
  params: {
    groupId: string;
  };
}

const page = async ({ params }: pageProps) => {
  const { groupId } = params;

  const sess = await getServerSession(authOptions);
  if (!sess) redirect("/login");

  const res: string[] = await fetchRedis(
    "zrange",
    `group:${groupId}:messages`,
    0,
    -1
  );
  const messages: GroupMessage[] = res.map((m) => {
    return JSON.parse(m) as GroupMessage;
  });

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
        {groupId}
        {/* <Messages
          initialMessages={initialMessages}
          sessionId={sess.user.id}
          chatPartnerData={chatPartnerData}
        />
        <ChatInput chatId={chatId} /> */}
      </div>
    </div>
  );
};

export default page;
