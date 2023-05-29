"use client";
import { pusherClient } from "@/lib/pusher";
import { cn, pusherKey } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

interface GroupMessagesProps {
  initialMessages: GroupMessage[];
  sessionId: string;
  chatId: string;
}

const GroupMessages: FC<GroupMessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
}) => {
  const [messages, setMessages] = useState<GroupMessage[]>(initialMessages);
  const bottomRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    const handleMessage = (messgae: GroupMessage) => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setMessages((prev) => {
        return [messgae, ...prev];
      });
    };
    pusherClient.subscribe(pusherKey(`group:${chatId}:group_message`));
    pusherClient.bind(`new_message`, handleMessage);

    return () => {
      pusherClient.unsubscribe(pusherKey(`group:${chatId}:group_message`));
      pusherClient.unbind("new_message", handleMessage);
    };
  }, []);

  return (
    <div className="w-full justify-center place-items-center flex h-[80%] overflow-scroll flex-col tooltip tooltip-open">
      <div className="flex flex-col-reverse w-[95%] p-3 overflow-scroll mt-auto">
        {messages.map((message, index) => {
          const isCurrUser = message.sender!.id === sessionId;
          const hasPrevMessage =
            messages[index + 1]?.sender!.id === messages[index].sender!.id;
          const hasNextMessage =
            messages[index - 1]?.sender!.id === messages[index].sender!.id;

          return (
            <div
              key={index}
              className={cn(
                "w-full flex",
                isCurrUser ? "justify-end" : "justify-start"
              )}
            >
              <div className="w-10 h-10 rounded-full relative mr-1 mt-auto">
                {!isCurrUser && !hasNextMessage ? (
                  <Image
                    sizes="1"
                    src={message.sender.image}
                    className="rounded-full"
                    fill
                    referrerPolicy="no-referrer"
                    alt="user image"
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="flex flex-col">
                {!hasPrevMessage && !isCurrUser ? (
                  <p className="text-xs self-start ml-2 text-zinc-300 mt-2">
                    {message.sender.name.split(" ")[0]}
                  </p>
                ) : (
                  ""
                )}
                <div
                  data-tip={`${formatDistanceToNow(message.timestamp, {
                    addSuffix: true,
                  })} · ${format(message.timestamp, "HH:mm")}`}
                  className={cn(
                    "tooltip w-fit p-2 px-4 max-w-lg min-h-10 min-w-10",
                    isCurrUser
                      ? "self-end bg-blue-600 tooltip-left"
                      : "self-start bg-slate-700 tooltip-right",
                    hasPrevMessage && isCurrUser
                      ? "rounded-l-2xl rounded-br-2xl mt-1"
                      : "mt-1 rounded-3xl",
                    hasPrevMessage && hasNextMessage
                      ? isCurrUser
                        ? "rounded-l-2xl rounded-r-md"
                        : "rounded-r-2xl rounded-l-md"
                      : "rounded-3xl mt-1",
                    hasNextMessage && !hasPrevMessage
                      ? isCurrUser
                        ? "rounded-l-2xl rounded-tr-2xl rounded-br-md"
                        : "rounded-2xl rounded-bl-md"
                      : "",
                    hasPrevMessage && !hasNextMessage
                      ? isCurrUser
                        ? "rounded-2xl rounded-tr-md"
                        : "rounded-2xl rounded-tl-md"
                      : ""
                  )}
                >
                  <p className="text-left text-sm break-all">{message.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={bottomRef} className=""></div>
    </div>
  );
};

export default GroupMessages;
