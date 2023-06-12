"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import { toast, type Toast } from "react-hot-toast";
import Button from "./Button";

interface NewMessageToastProps {
  t: Toast;
  message: Message;
  user: User;
}

const NewMessageToast: FC<NewMessageToastProps> = ({ t, message, user }) => {
  return (
    <a>
      <div
        className={cn(
          "w-96 p-3 mb-1 rounded-lg pointer-events-auto bg-off flex cursor-pointer drop-shadow-lg",
          { "animate-enter": t.visible, "animate-leave": !t.visible }
        )}
      >
        <div className="self-start mr-1 flex gap-2 w-full place-items-center">
          <Image
            referrerPolicy="no-referrer"
            className="rounded-full max-h-[45px]"
            placeholder="empty"
            width={45}
            height={45}
            src={user.image as string}
            alt="friend profile picture"
          />
          <div>
            <p>{user.name}</p>
            <p className="text-sm text-zinc-400">{message.text}</p>
          </div>
        </div>
        <div className="ml-auto">
          <Button variant={"ghost"} onClick={() => toast.dismiss(t.id)}>
            Close
          </Button>
        </div>
      </div>
    </a>
  );
};

export default NewMessageToast;
