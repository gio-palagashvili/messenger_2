"use client";
import { chatIdConstructor, cn, pusherKey } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

interface ChatListProps {
  friends: ChatList[];
  session: Session;
}

const ChatList: FC<ChatListProps> = ({ friends, session }) => {
  const [unseen, setUnseen] = useState<Message[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(1);
  const [friendsState, setFriendsState] = useState<ChatList[]>(friends);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes("home")) {
      setUnseen((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  useEffect(() => {
    pusherClient.subscribe(pusherKey(`user:${session.user.id}:chats`));
    pusherClient.subscribe(pusherKey(`user:${session.user.id}:sent`));

    const messageHandler = (message: Message) => {
      setFriendsState((prev) => {
        return prev.map((friend) => {
          if (friend.id === message.senderId) {
            const newData = {
              ...friend,
              text: message.text,
              timestamp: message.timestamp,
            };
            return newData;
          }
          return friend;
        });
      });
    };

    const messageHandlerSent = (message: Message) => {
      setFriendsState((prev) => {
        return prev.map((friend) => {
          if (friend.id === message.recieverId) {
            const newData = {
              ...friend,
              id: session.user.id,
              text: message.text,
              timestamp: message.timestamp,
            };
            return newData;
          }
          return friend;
        });
      });
    };

    pusherClient.bind("unseen_message", messageHandler);
    pusherClient.bind("unseen_message_me", messageHandlerSent);

    return () => {
      pusherClient.unbind("unseen_message", messageHandler);
      pusherClient.unbind("unseen_message_me", messageHandlerSent);
      pusherClient.unsubscribe(pusherKey(`user:${session.user.id}}:chats`));
      pusherClient.unsubscribe(pusherKey(`user:${session.user.id}}:sent`));
    };
  }, []);

  return (
    <div className="h-[80%] max-h-[80%] w-full overflow-y-scroll p-4 flex flex-col mt-1">
      {friendsState.length > 0 ? (
        friendsState
          .sort((a, b) => {
            const timestampA = new Date(a.timestamp).getTime();
            const timestampB = new Date(b.timestamp).getTime();

            return timestampB - timestampA;
          })
          .map((friend, index) => {
            const chatId = chatIdConstructor(session.user.id, friend.id);

            const unSeenMess = unseen.filter((unseenMsg) => {
              return unseenMsg.senderId === friend.id;
            }).length;

            return (
              <a
                href={`/home/chat/${chatId}`}
                key={friend.id}
                className={cn(
                  "hover:bg-[#111318] p-3 rounded-lg duration-300 -mt-1 cursor-pointer"
                  // todo selectedIndex === index ? "bg-[#111318]" : ""
                )}
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
                      className="text-white text-[0.9rem] flex justify-between w-full"
                    >
                      <span>{friend.name}</span>
                    </span>
                    <span
                      className="text-[0.80rem] text-zinc-400 mt-[-2px] ml-[2px]"
                      aria-hidden="true"
                    >
                      {friend.text} · {format(friend.timestamp, "HH:mm")}
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
        <p className="text-zinc-400">You have no friends yet ;(</p>
      )}
    </div>
  );
};

export default ChatList;
