import AddFriend from "@/components/AddFriend";

export const metadata = {
  title: "Add friends",
  description: "add friends messenger",
};

const page = ({}) => {
  return (
    <div className="m-auto flex flex-col place-items-center w-1/2">
      <AddFriend />
    </div>
  );
};

export default page;
