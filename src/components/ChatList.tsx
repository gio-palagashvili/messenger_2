"use client";
import { chatIdConstructor, cn, pusherKey } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import toast, { Toaster } from "react-hot-toast";
import NewMessageToast from "./ui/NewMessageToast";

interface ChatListProps {
  friends: ChatList[];
  session: Session;
}

const ChatList: FC<ChatListProps> = ({ friends, session }) => {
  const [unseen, setUnseen] = useState<Message[]>([]);
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
    pusherClient.subscribe(pusherKey(`user:${session.user.id}:friends`));

    const messageHandler = (message: Message) => {
      if (
        pathname ==
        `/home/chat/${chatIdConstructor(session.user.id, message.senderId)}`
      ) {
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
        return;
      }

      setFriendsState((prev) => {
        return prev.map((friend) => {
          if (friend.id === message.senderId) {
            toast.custom((t) => (
              <NewMessageToast message={message} user={friend} t={t} />
            ));
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

    const friendHandler = (item: ChatList) => {
      setFriendsState((prev) => {
        return [...prev, item];
      });
    };

    pusherClient.bind("unseen_message", messageHandler);
    pusherClient.bind("curr_user_sent", messageHandlerSent);
    pusherClient.bind("friend_accepted", friendHandler);

    return () => {
      pusherClient.unbind("unseen_message", messageHandler);
      pusherClient.unbind("curr_user_sent", messageHandlerSent);
      pusherClient.unbind("friend_accepted", friendHandler);

      pusherClient.unsubscribe(pusherKey(`user:${session.user.id}:friends`));
      pusherClient.unsubscribe(pusherKey(`user:${session.user.id}:chats`));
      pusherClient.unsubscribe(pusherKey(`user:${session.user.id}:sent`));
    };
  }, [pathname, session.user.id]);

  return (
    <>
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />
      <div className="h-[80%] max-h-[80%] w-full overflow-y-scroll p-4 flex flex-col mt-1 gap-3 md:gap-0">
        {friendsState.length > 0 ? (
          friendsState
            .sort((a, b) => {
              const timestampA = new Date(a.timestamp).getTime();
              const timestampB = new Date(b.timestamp).getTime();

              return timestampB - timestampA;
            })
            .map((friend, index) => {
              const chatId = chatIdConstructor(session.user.id, friend.id);
              return (
                <a
                  href={`/home/chat/${chatId}`}
                  key={friend.id}
                  className={cn(
                    "md:hover:bg-[#111318] md:p-3 rounded-lg duration-300 -mt-1 cursor-pointer w-full"
                    // todo selectedIndex === index ? "bg-[#111318]" : ""
                  )}
                >
                  <div className="flex gap-[0.4rem]">
                    <div className="relative w-14 h-14 flex md:w-11 md:h-11 hover:scale-95 duration-400">
                      <Image
                        referrerPolicy="no-referrer"
                        className="rounded-full min-w-[3.5rem] md:min-w-[2.75rem]"
                        placeholder="empty"
                        fill={true}
                        sizes="2.25rem"
                        src={friend.image as string}
                        alt="friend profile picture"
                      />
                    </div>
                    <div className="hidden md:flex flex-col w-[70%]">
                      <span
                        aria-hidden="true"
                        className="text-white text-[0.9rem] flex justify-between w-full"
                      >
                        <span>{friend.name}</span>
                      </span>
                      <div className="flex gap-[0.1rem]">
                        <span
                          className="text-[0.80rem] text-zinc-400 mt-[-2px] ml-[2px] truncate"
                          aria-hidden="true"
                        >
                          {friend.text}
                        </span>
                        {friend.timestamp ? (
                          <>
                            <span className="text-[0.80rem] text-zinc-400 mt-[-2px] ml-[2px]">
                              ·
                            </span>
                            <span className="text-[0.80rem] text-zinc-400 mt-[-2px] ml-[2px]">
                              {format(friend.timestamp, "HH:mm")}
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
        ) : (
          <p className="text-zinc-400">You have no friends yet ;(</p>
        )}
      </div>
    </>
  );
};

export default ChatList;
