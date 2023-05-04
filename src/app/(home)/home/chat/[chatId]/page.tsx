import { fetchRedis, getUsersById } from "@/app/helpers/redis";
import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import ChatHeader from "@/components/ui/ChatHeader";
import { authOptions } from "@/lib/authOptions";
import { messagesValidator } from "@/lib/validators/messages.zod";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
interface pageProps {
  params: {
    chatId: string;
  };
}
const getChatMessages = async (chatId: string) => {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const mess = result.map((m) => JSON.parse(m) as Message);
    const ordered = mess.reverse();

    const messages = messagesValidator.parse(ordered);
    return messages;
  } catch (error) {
    notFound();
  }
};

const page = async ({ params }: pageProps) => {
  const { chatId } = params;

  const sess = await getServerSession(authOptions);
  if (!sess) redirect("/login");

  const { user } = sess;
  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) notFound();
  //todo  add chat-notFound()

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerData = JSON.parse(
    (await fetchRedis("get", `user:${chatPartnerId}`)) as string
  ) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="w-full h-full">
      <ChatHeader chatPartnerData={chatPartnerData} />
      <div className="divider mt-0 mb-0 h-1"></div>
      <Messages initialMessages={initialMessages} sessionId={sess.user.id} />
      <ChatInput />
    </div>
  );
};

export default page;
