"use client";
import { cn, pusherKey } from "@/lib/utils";
import { Session } from "next-auth";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Toaster } from "react-hot-toast";

interface GroupListProps {
  groups: GroupListItem[];
  session: Session;
}

const GroupList: FC<GroupListProps> = ({ groups, session }) => {
  const [unseen, setUnseen] = useState<Message[]>([]);
  const [groupState, setGroupState] = useState<GroupListItem[]>(groups);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes("home")) {
      setUnseen((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  useEffect(() => {
    const handleGroup = (groupData: GroupListItem) => {
      setGroupState((prev) => {
        return [...prev, groupData];
      });
    };

    const handleNewMessage = (message: GroupMessage) => {
      setGroupState((prev) => {
        return prev.map((msg) => {
          if (msg.senderName == message.sender.name) {
            const newData: GroupListItem = {
              ...msg,
              latestMessage: message.text,
              timestamp: message.timestamp,
              senderName: message.sender.name,
            };
            return newData;
          }
          return msg;
        });
      });
    };

    groupState.map((group) => {
      pusherClient.subscribe(pusherKey(`group:${group.groupId}:group_message`));
      pusherClient.bind("new_message", handleNewMessage);
    });

    pusherClient.subscribe(pusherKey(`user:newGroup:${session.user.id}`));
    pusherClient.bind(`added_to_group`, handleGroup);

    return () => {
      pusherClient.unsubscribe(pusherKey(`user:group:${session.user.id}`));
      pusherClient.unbind(`added_to_group`, handleGroup);
      groupState.map((group) => {
        pusherClient.unsubscribe(
          pusherKey(`group:${group.groupId}:group_message`)
        );
        pusherClient.unbind("new_message", handleNewMessage);
      });
    };
  }, [pathname, session.user.id, groupState]);

  return (
    <>
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />
      <div className="h-[80%] max-h-[80%] w-full overflow-y-scroll p-4 flex flex-col mt-1 gap-3 md:gap-0">
        {groupState.length > 0 ? (
          groupState
            .sort((a, b) => {
              const timestampA = new Date(a.timestamp).getTime();
              const timestampB = new Date(b.timestamp).getTime();

              return timestampB - timestampA;
            })
            .map((group) => {
              return (
                <a
                  href={`/home/group/${group.groupId}`}
                  key={group.groupId}
                  className={cn(
                    "md:hover:bg-[#111318] md:p-3 rounded-lg duration-300 -mt-1 cursor-pointer w-full"
                  )}
                >
                  <div className="flex gap-[0.4rem]">
                    <div
                      className={`relative w-14 h-14 flex md:w-11 md:h-11 hover:scale-95 duration-400 rounded-full 
                      place-items-center`}
                      style={{ backgroundColor: group.image }}
                    >
                      <p className="text-center absolute top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                        {group.name.split("")[0]}
                      </p>
                    </div>
                    <div className="hidden md:flex flex-col w-[70%]">
                      <span
                        aria-hidden="true"
                        className="text-white text-[0.9rem] flex justify-between w-full"
                      >
                        <span>{group.name}</span>
                      </span>
                      <div className="flex gap-[0.1rem]">
                        <span
                          className="text-[0.80rem] text-zinc-400 mt-[-2px] ml-[2px] truncate"
                          aria-hidden="true"
                        >
                          {group.senderName === session.user.name
                            ? "you"
                            : group.senderName.split(" ")[0]}
                          : {group.latestMessage}
                        </span>
                        {group.timestamp ? (
                          <>
                            <span className="text-[0.80rem] text-zinc-400 mt-[-2px] ml-[2px]">
                              ·
                            </span>
                            <span className="text-[0.80rem] text-zinc-400 mt-[-2px] ml-[2px]">
                              {format(group.timestamp, "HH:mm")}
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
          <p className="text-zinc-400 text-sm">
            You are not a part of a group yet.
          </p>
        )}
      </div>
    </>
  );
};

export default GroupList;
