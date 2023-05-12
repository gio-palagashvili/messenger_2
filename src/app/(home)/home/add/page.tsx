import AddFriendButton from "@/components/AddFriendButton";

export const metadata = {
  title: "Add friends",
  description: "add friends messenger",
};

const page = ({}) => {
  return (
    <div className="m-auto flex flex-col place-items-center w-1/2">
      <AddFriendButton />
    </div>
  );
};

export default page;
