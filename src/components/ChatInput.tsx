"use client";
import { FC, useState } from "react";
import Button from "./ui/Button";
import { IoSendSharp } from "react-icons/io5";
interface ChatInputProps {}

const ChatInput: FC<ChatInputProps> = ({}) => {
  const sendMessage = () => {
    setInput("");
  };
  const [input, setInput] = useState<string>("");
  return (
    <div className="w-full h-[10%] flex justify-center gap-2 place-items-center">
      <input
        value={input}
        placeholder="Aa"
        className="input bg-off w-1/2 font-light"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <Button className="flex gap-1" onClick={sendMessage}>
        <IoSendSharp />
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
