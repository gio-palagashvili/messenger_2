"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatPartnerData: User;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatPartnerData,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="w-full justify-center place-items-center flex h-[80%] overflow-scroll flex-col">
      <div className="flex flex-col-reverse w-[95%] p-3 overflow-scroll mt-auto">
        {messages.map((message, index) => {
          const isCurrUser = message.senderId === sessionId;

          //! messages array is reversed so thats why +1 is prev -1 is next
          const hasPrevMessage =
            messages[index + 1]?.senderId === messages[index].senderId;
          const hasNextMessage =
            messages[index - 1]?.senderId === messages[index].senderId;
          return (
            <div
              key={index}
              className={cn(
                "w-full flex",
                isCurrUser
                  ? !hasPrevMessage
                    ? "justify-end mt-2"
                    : "justify-end"
                  : !hasPrevMessage
                  ? "justify-start mt-2"
                  : "justify-start"
              )}
            >
              {!isCurrUser ? (
                <div className="w-10 h-10 rounded-full relative mr-1 mt-auto">
                  {!hasNextMessage ? (
                    <Image
                      sizes="1"
                      src={chatPartnerData.image}
                      className="rounded-full"
                      fill
                      referrerPolicy="no-referrer"
                      alt="chat partner image"
                    />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              <div
                className={cn(
                  "w-fit p-2 px-4 max-w-lg min-h-10 min-w-10",
                  isCurrUser
                    ? "self-end bg-blue-600"
                    : "self-start bg-slate-700",
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
                <p className="text-left text-sm">{message.text}</p>
                <p className="">{}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={bottomRef} className=""></div>
    </div>
  );
};

export default Messages;
