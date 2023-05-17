import AddFriendButton from "@/components/AddFriendButton";

export const metadata = {
  title: "Add friends",
  description: "add friends messenger",
};

const page = async ({}) => {
  return (
    <div className="m-auto flex flex-col place-items-center w-1/2">
      <div className="w-full flex flex-col place-items-center">
        <div className="w-[90%] flex flex-col gap-3 lg:w-[60%]">
          <h1 className="text-4xl bold ml-[0.20rem]">Add a friend</h1>
          <AddFriendButton />
        </div>
      </div>
    </div>
  );
};

export default page;
