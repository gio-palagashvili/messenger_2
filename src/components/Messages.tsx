"use client";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  return (
    <div className="flex flex-col-reverse h-[80%] w-full p-3" id="zed">
      {messages.map((message, index) => {
        const isCurrUser = message.senderId === sessionId;

        //! arr is reversed thats why +1 is prev -1 is next
        const hasPrevMessage =
          messages[index + 1]?.senderId === messages[index].senderId;
        const hasNextMessage =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div
            className={cn(
              "w-fit bg-blue-500 p-2 px-4 max-w-lg min-h-10 min-w-10",
              isCurrUser ? "self-end" : "self-start",
              hasPrevMessage && isCurrUser
                ? "rounded-l-2xl rounded-br-2xl mt-1"
                : "mt-2 rounded-3xl",
              hasPrevMessage && hasNextMessage && isCurrUser
                ? "rounded-l-2xl rounded-r-md"
                : "rounded-3xl",
              hasNextMessage && !hasPrevMessage && isCurrUser
                ? "rounded-l-2xl rounded-tr-2xl rounded-br-md"
                : "",
              hasPrevMessage && !hasNextMessage && isCurrUser
                ? "rounded-2xl rounded-tr-md"
                : ""
            )}
            key={index}
          >
            <p className="text-left text-md">{message.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
