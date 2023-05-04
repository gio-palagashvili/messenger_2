"use client";
import { FC, useState } from "react";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  return (
    <div className="flex flex-col-reverse h-[80%]">
      {messages.map((message, index) => {
        const isCurrUser = message.senderId === sessionId;
        const isConcurrent =
          messages[index - 1].senderId == messages[index].senderId;

        return <div className="" key={index}></div>;
      })}
    </div>
  );
};

export default Messages;
