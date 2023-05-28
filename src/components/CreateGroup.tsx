"use client";
import { FC, useRef, useState } from "react";
import { FaUsers, FaSearch } from "react-icons/fa";
import Button from "@/components/ui/Button";
import useClickOutside from "@/hooks/useClickOutside";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Image from "next/image";
import { errorToast, successToast } from "@/lib/customToasts";
import axios from "axios";

interface CreateGroupButtonProps {
  friends: ChatList[];
}

const CreateGroupButton: FC<CreateGroupButtonProps> = ({ friends }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedFriends, setSelectedFriends] = useState<ChatList[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    // i didnt use handleClose here because user might accidentally click outside
    setOpen(false);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      createGroup();
    }
  };

  const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const createGroup = () => {
    if (groupName?.length === 0) {
      errorToast("name too short");
      return;
    }
    if (selectedFriends.length == 0) {
      errorToast("add atleast one friend");
      return;
    }
    setIsLoading(true);
    axios
      .post("/api/group/create", {
        groupName,
        selectedFriends,
      })
      .then(() => {
        successToast("group created");
        handleClose();
      })
      .catch((err) => {
        errorToast(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleClose = () => {
    setOpen(false);
    setIsLoading(false);
    setSelectedFriends([]);
  };

  return (
    <>
      <Button className="text-sm" onClick={() => setOpen((prev) => !prev)}>
        <FaUsers size={15} />
        create
      </Button>
      {isOpen ? (
        <Modal ref={ref} variant={"blur"}>
          <div></div>
          <div className="search_div mb-3">
            <div className="flex w-full flex-col place-items-center gap-3">
              <FaUsers size={35} />
              <h2 className="text-3xl font-medium">Invite friends</h2>
              <p className="text-md text-zinc-400">
                select the friends you want to add to this group.
              </p>
            </div>
            <div className="input_div relative block mt-10">
              <FaSearch
                size={15}
                className="pointer-events-none absolute transform left-3 idk"
              />
              <Input
                onKeyDown={(e) => handleKeydown(e)}
                className="pl-9"
                placeholder="search friends..."
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="friend_list_div w-full gap-2 flex flex-col overflow-scroll max-h-48 h-48 mb-4">
            {friends
              .filter((friend) => {
                if (searchQuery) {
                  return friend.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    friend.email
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                    ? friend
                    : null;
                } else {
                  return friend;
                }
              })
              .sort((a, b) => {
                const timestampA = new Date(a.timestamp).getTime();
                const timestampB = new Date(b.timestamp).getTime();

                return timestampB - timestampA;
              })
              .map((friend, index) => {
                return (
                  <div
                    className="bg-off p-2 h-16 min-h-16 flex place-items-center rounded-lg w-full"
                    key={index}
                  >
                    <div className="flex gap-2 font-semibold place-items-center w-full">
                      <div className="relative h-10 w-10">
                        <Image
                          referrerPolicy="no-referrer"
                          className="rounded-full"
                          placeholder="empty"
                          fill={true}
                          sizes="2.5rem"
                          src={friend.image as string}
                          alt="Your profile picture"
                        />
                      </div>
                      <div className="flex gap-10 justify-center place-items-center">
                        <div className="flex flex-col">
                          <span
                            aria-hidden="true"
                            className="text-white text-sm font-medium"
                          >
                            {friend.name}
                          </span>
                          <span
                            className="text-xs text-zinc-400 font-medium"
                            aria-hidden="true"
                          >
                            {friend.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {!selectedFriends.includes(friend) ? (
                        <Button
                          variant={"pill"}
                          size={"pill"}
                          className="font-medium"
                          onClick={() =>
                            setSelectedFriends((prev) => {
                              return [...prev, friend];
                            })
                          }
                        >
                          Add
                        </Button>
                      ) : (
                        <Button
                          variant={"pill"}
                          size={"pill"}
                          className="font-medium text-red-500 px-3"
                          onClick={() =>
                            setSelectedFriends((prev) => {
                              return prev.filter(
                                (friendPrev) => friendPrev !== friend
                              );
                            })
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="name_div flex flex-col h-20">
            <label htmlFor="" className="text-xs ml-1 mb-[0.3rem]">
              Name
            </label>
            <Input
              placeholder="group chat #1"
              onChange={(e) => setName(e)}
              onKeyDown={(e) => handleKeydown(e)}
            />
          </div>
          <div className="final_buttons h-10 flex justify-end gap-2">
            <Button variant={"ghostUnderline"} onClick={handleClose}>
              cancel
            </Button>
            <Button onClick={createGroup} isLoading={isLoading}>
              save
            </Button>
          </div>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default CreateGroupButton;
