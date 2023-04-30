import { fetchRedis, getUsersById } from "@/app/helpers/redis";
import { authOptions } from "@/lib/authOptions";
import { messagesValidator } from "@/lib/validators/messages.zod";
import { getServerSession } from "next-auth";
import Image from "next/image";
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

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerData = JSON.parse(
    (await fetchRedis("get", `user:${chatPartnerId}`)) as string
  ) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="w-full h-full">
      <div className="w-full h-20 flex pl-3">
        <div className="flex gap-2 text-sm font-semibold justify-center place-items-center">
          <div className="relative h-11 w-11">
            <Image
              referrerPolicy="no-referrer"
              className="rounded-full"
              placeholder="empty"
              fill={true}
              sizes="2.25rem"
              src={chatPartnerData.image as string}
              alt="Your profile picture"
            />
          </div>
          <div className="flex gap-10 justify-center place-items-center">
            <div className="flex flex-col">
              <span aria-hidden="true" className="text-white text-md">
                {chatPartnerData.name}
              </span>
              <span className="text-sm text-zinc-400" aria-hidden="true">
                {chatPartnerData.email}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="divider mt-0 mb-0 h-1"></div>
      <div></div>
    </div>
  );
};

export default page;
