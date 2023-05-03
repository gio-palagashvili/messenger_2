"use client";
import { FC } from "react";
import { AiFillDelete } from "react-icons/ai";
import Button from "./Button";
import Image from "next/image";
import axios from "axios";

interface ChatHeaderProps {
  chatPartnerData: User;
}

const ChatHeader: FC<ChatHeaderProps> = ({ chatPartnerData }) => {
  const removeFriend = (chatPartnerId: string) => {
    axios
      .post("/api/friends/remove", { id: chatPartnerId })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {});
  };

  return (
    <div className="w-full h-16 flex pl-3">
      <div className="flex w-full">
        <div className="flex gap-2 text-sm font-semibold place-items-center w-full">
          <div className="relative h-10 w-10">
            <Image
              referrerPolicy="no-referrer"
              className="rounded-full"
              placeholder="empty"
              fill={true}
              sizes="2.25rem"
              src={chatPartnerData.image as string}
              alt="Your profile picture"
            />
          </div>
          <div className="flex gap-10 justify-center place-items-center">
            <div className="flex flex-col">
              <span aria-hidden="true" className="text-white text-md">
                {chatPartnerData.name}
              </span>
              <span className="text-xs text-zinc-400" aria-hidden="true">
                {chatPartnerData.email}
              </span>
            </div>
          </div>
        </div>
        <div className="flex place-items-center">
          <Button
            className="mr-6 text-[0.80rem]"
            size={"default"}
            onClick={() => removeFriend(chatPartnerData.id)}
          >
            <AiFillDelete />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
