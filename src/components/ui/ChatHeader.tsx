"use client";
import { FC, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import Button from "./Button";
import Image from "next/image";
import axios from "axios";
import { redirect } from "next/navigation";

interface ChatHeaderProps {
  chatPartnerData?: User;
  groupDetails?: Group;
}

const ChatHeader: FC<ChatHeaderProps> = ({ chatPartnerData, groupDetails }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const removeFriend = (chatPartnerId: string) => {
    setLoading(true);
    axios
      .post("/api/friends/remove", { id: chatPartnerId })
      .then(() => {
        redirect("/home");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full h-16 flex pl-3 justify-center place-items-center">
      <div className="flex w-[95%]">
        <div className="flex gap-2 text-sm font-semibold place-items-center w-full">
          <div className="relative h-11 w-11">
            <Image
              referrerPolicy="no-referrer"
              className="rounded-full"
              placeholder="empty"
              fill={true}
              sizes="2.25rem"
              src={
                chatPartnerData
                  ? (chatPartnerData.image as string)
                  : (groupDetails?.image as string)
              }
              alt="Your profile picture"
            />
          </div>
          <div className="flex gap-10 justify-center place-items-center">
            <div className="flex flex-col">
              <span aria-hidden="true" className="text-white text-md">
                {chatPartnerData ? chatPartnerData.name : groupDetails!.name}
              </span>
              {chatPartnerData ? (
                <span className="text-xs text-zinc-400" aria-hidden="true">
                  {chatPartnerData.email}
                </span>
              ) : (
                <div className="flex gap-1 overflow-ellipsis">
                  {groupDetails!.members.map((u, index) => {
                    const user = JSON.parse(u) as User;
                    return (
                      <span
                        className="text-xs text-zinc-400"
                        aria-hidden="true"
                        key={index}
                      >
                        {user.name}
                        {groupDetails!.members.length - 1 == index ? "" : ","}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex place-items-center">
          {chatPartnerData ? (
            <Button
              className="text-[0.80rem] min-w-[100px]"
              isLoading={loading}
              showLoading={false}
              onClick={() => removeFriend(chatPartnerData?.id)}
            >
              <AiFillDelete />
              Delete
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
