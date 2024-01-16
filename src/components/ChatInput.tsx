"use client";
import { FC, useState, useRef, useEffect } from "react";
import Button from "../components/ui/Button";
import { IoSendSharp, IoAttach } from "react-icons/io5";
import axios from "axios";
import { cn } from "@/lib/utils";
import { errorToast } from "@/lib/customToasts";

interface ChatInputProps {
  chatId: string;
  isGroup?: boolean;
}

const ChatInput: FC<ChatInputProps> = ({ chatId, isGroup }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>();

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && file) {
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", (event) => handleEscape(event));

    return () => {
      document.removeEventListener("keydown", (event) => handleEscape(event));
    };
  }, []);

  const sendMessage = () => {
    setIsLoading(true);
    if (input.length == 0 && !file) {
      errorToast("please write one or more letters");
      setIsLoading(false);
    } else {
      const url = !isGroup ? "/api/messages/send" : "/api/group/send";
      axios
        .post(url, {
          text: input,
          chatId: chatId,
          type: "message",
        })
        .catch((err) => {
          errorToast(err.message);
          setFile(null);
        })
        .finally(() => {
          setFile(null);
          setInput("");
          setIsLoading(false);
        });
    }
  };

  const handleChange = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <div className="w-full h-[10%] flex justify-center gap-2 place-items-center">
      <div className="w-[70%] lg:w-[80%] flex justify-center place-items-center">
        <textarea
          value={
            !file
              ? input
              : `you attached an ${file.type}, press escape to remove`
          }
          ref={textareaRef}
          placeholder="Aa"
          className={cn(
            "input bg-off w-full font-light resize-none text-start placeholder-center p-3",
            file ? "opacity-50" : ""
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
