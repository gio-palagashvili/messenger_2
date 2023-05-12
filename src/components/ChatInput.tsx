"use client";
import { FC, useState, useRef } from "react";
import Button from "./ui/Button";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>();

  const sendMessage = () => {
    setInput("");
    setIsLoading(true);

    axios
      .post("/api/messages/send", {
        text: input,
        chatId: chatId,
      })
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleChange = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  return (
    <div className="w-full h-[10%] flex justify-center gap-2 place-items-center">
      <div className="w-[70%] lg:w-[80%] flex justify-center place-items-center">
        <textarea
          value={input}
          ref={textareaRef}
          placeholder="Aa"
          className={cn(
            "input bg-off w-full font-light resize-none text-start placeholder-center p-3"
          )}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleChange(e)}
        />
      </div>
      <Button
        className="flex gap-1"
        onClick={sendMessage}
        isLoading={isLoading}
        size={"load"}
        loadingType={"animate-pulse"}
        showLoading={false}
      >
        <IoSendSharp />
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
