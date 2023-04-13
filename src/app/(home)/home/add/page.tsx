import AddFriendButton from "@/components/AddFriendButton";
import { FC } from "react";

const page = ({}) => {
  return (
    <div className="m-auto flex flex-col place-items-center w-full ">
      <h1 className="text-3xl">Add a friend</h1>
      <AddFriendButton />
    </div>
  );
};

export default page;
