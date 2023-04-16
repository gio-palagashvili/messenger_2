import AddFriend from "@/components/AddFriend";
export const metadata = {
  title: "Add friends",
  description: "add friends messenger",
};

const page = ({}) => {
  return (
    <div className="m-auto flex flex-col place-items-center w-full ">
      <h1 className="text-3xl">Add a friend</h1>
      <AddFriend />
    </div>
  );
};

export default page;
