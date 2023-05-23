import AddFriendButton from "@/components/AddFriendButton";

export const metadata = {
  title: "Add friends",
  description: "add friends messenger",
};

const page = async ({}) => {
  return (
    <div className="m-auto flex flex-col place-items-center w-full">
      <div className="w-full flex flex-col place-items-center">
        <div className="w-[90%] md:w-[80%] lg:w-[35rem] flex flex-col gap-3">
          <h1 className="text-4xl bold ml-[0.20rem]">Add a friend</h1>
          <AddFriendButton />
        </div>
      </div>
    </div>
  );
};

export default page;
