"use client";
import { chatIdConstructor } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

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
              href={`/home/chat/${chatIdConstructor(
                session.user.id,
                friend.id
              )}`}
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
                <div className="flex flex-col w-[70%]">
                  <span
                    aria-hidden="true"
                    className="text-white text-[1rem] flex justify-between w-full"
                  >
                    <span>{friend.name}</span>
                  </span>
                  <span
                    className="text-[0.80rem] text-zinc-400 mt-[-4px] ml-[2px]"
                    aria-hidden="true"
                  >
                    whats up · 12:21 PM
                  </span>
                </div>
                <div className="flex justify-center place-items-center">
                  <span
                    className={
                      unSeenMess > 0
                        ? "text-xs h-5 w-5 bg-red-500 rounded-full flex justify-center place-items-center"
                        : "text-xs h-5 w-5"
                    }
                  >
                    {unSeenMess > 0 ? unSeenMess : ""}
                  </span>
                </div>
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
