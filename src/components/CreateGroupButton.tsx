"use client";
import { FC, useRef, useState } from "react";
import { FaUsers, FaSearch } from "react-icons/fa";
import Button from "@/components/ui/Button";
import useClickOutside from "@/hooks/useClickOutside";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

interface CreateGroupButtonProps {}

const CreateGroupButton: FC<CreateGroupButtonProps> = ({}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Button className="text-sm" onClick={() => setOpen((prev) => !prev)}>
        <FaUsers size={15} />
        create
      </Button>
      {isOpen ? (
        <Modal ref={ref} variant={"default"}>
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
            <input
              className="w-full bg-base-200 input pl-9"
              placeholder="search friends..."
            />
          </div>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default CreateGroupButton;
