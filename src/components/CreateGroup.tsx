"use client";
import { FC, useRef, useState } from "react";
import { FaUsers, FaSearch } from "react-icons/fa";
import Button from "@/components/ui/Button";
import useClickOutside from "@/hooks/useClickOutside";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Image from "next/image";

interface CreateGroupButtonProps {
  friends: ChatList[];
}

const CreateGroupButton: FC<CreateGroupButtonProps> = ({ friends }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedFriends, setSelectedFriends] = useState<ChatList[]>([]);
  const [friendsState, setFriendsState] = useState<ChatList[]>(friends);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    setOpen(false);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Button className="text-sm" onClick={() => setOpen((prev) => !prev)}>
        <FaUsers size={15} />
        create
      </Button>
      {isOpen ? (
        <Modal ref={ref} variant={"blur"}>
          <div className="search_div mb-3">
            <div className="flex w-full flex-col place-items-center gap-3">
              <FaUsers size={35} />
              <h2 className="text-3xl font-medium">Invite friends</h2>
              <p className="text-md text-zinc-400">
                select the friends you want to add to this group.
              </p>
            </div>
            <div className="relative block mt-10">
              <FaSearch
                size={15}
                className="pointer-events-none absolute transform left-3 idk"
              />
              <Input
                className="pl-9"
                placeholder="search friends..."
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="friend_list_div w-full gap-2 flex flex-col overflow-scroll h-64 mb-4">
            {friendsState
              .filter((friend) => {
                if (searchQuery) {
                  return friend.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    friend.email
                      .toLowerCase()
                      .split("@")[0]
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
          <div className="final_buttons h-10 flex justify-end gap-2">
            <Button variant={"ghostUnderline"} onClick={() => setOpen(false)}>
              close
            </Button>
            <Button>save</Button>
          </div>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default CreateGroupButton;
