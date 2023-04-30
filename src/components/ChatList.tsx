"use client";
import { chatHref } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { FaUserSlash } from "react-icons/fa";

interface ChatListProps {
  friends: User[];
  session: Session;
}

const ChatList: FC<ChatListProps> = ({ friends, session }) => {
  const [unseen, setUnseen] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname?.includes("home")) {
      setUnseen((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <div className="h-[80%] max-h-[80%] w-full overflow-y-scroll p-4 flex flex-col gap-3">
      {friends.length > 0 ? (
        friends.sort().map((friend, index) => {
          const unSeenMess = unseen.filter((unseenMsg) => {
            return unseenMsg.senderId === friend.id;
          }).length;

          return (
            <a
              href={`/home/chat/${chatHref(session.user.id, friend.id)}`}
              key={friend.id}
            >
              <div className="flex gap-[0.4rem]">
                <div className="relative h-11 w-11">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    placeholder="empty"
                    fill={true}
                    sizes="2.25rem"
                    src={friend.image as string}
                    alt="friend profile picture"
                  />
                </div>
                <div className="flex flex-col">
                  <span aria-hidden="true" className="text-white text-[1rem]">
                    {friend.name}
                  </span>
                  <span
                    className="text-[0.80rem] text-zinc-400 mt-[-4px] ml-[2px]"
                    aria-hidden="true"
                  >
                    whats up · 12:21 PM
                  </span>
                </div>
                <span className="flex place-items-center justify-center ml-auto">
                  {/* <FaUserSlash className="mt-2" size={13} /> */}
                </span>
              </div>
            </a>
          );
        })
      ) : (
        <p>You have no friends yet ;(</p>
      )}
    </div>
  );
};

export default ChatList;
