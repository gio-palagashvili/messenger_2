import { Session } from "next-auth";
import Image from "next/image";
import Button from "@/components/ui/Button";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";
import { BsPersonPlusFill } from "react-icons/bs";
import FriendRequestsButton from "@/components/FriendRequestsButton";
import { getUserFriendsById, getUserGroups } from "@/app/helpers/redis";
import ChatList from "@/components/ChatList";
import CreateGroupButton from "../CreateGroup";

interface NavProps {
  session: Session;
  initialReqsCount: number;
}

const Nav = async ({ session, initialReqsCount }: NavProps) => {
  const friends = await getUserFriendsById(session.user.id, true);
  const userGroups = await getUserGroups(session.user.id, true);

  return (
    <div className="w-20 md:min-w-[300px] h-full bg-off md:flex justify-center flex-col place-items-center">
      <div className="hidden h-[10%] w-full p-3 md:flex">
        <div className="flex gap-1 justify-center">
          <CreateGroupButton friends={friends} />
          <Link href={"home/requests"}>
            <FriendRequestsButton
              sessionId={session.user.id}
              initialReqsCount={initialReqsCount}
            />
          </Link>
          <Link href={"home/add"}>
            <Button>
              <BsPersonPlusFill size={15} />
            </Button>
          </Link>
        </div>
      </div>
      <ChatList friends={friends} session={session} />
      <div className="md:flex gap-2 text-sm font-semibold justify-center place-items-center">
        <div className="relative h-9 w-9 hidden md:flex">
          <Image
            referrerPolicy="no-referrer"
            className="rounded-full"
            placeholder="empty"
            fill={true}
            sizes="2.25rem"
            src={session.user.image as string}
            alt="Your profile picture"
          />
        </div>
        <div className="md:flex gap-10">
          <div className="flex flex-col justify-center">
            <span aria-hidden="true" className="text-white text-left">
              {session.user.name}
            </span>
            <span
              className="text-xs text-zinc-400 hidden md:flex"
              aria-hidden="true"
            >
              {session.user.email}
            </span>
          </div>
          <div className="">
            <SignOutButton>
              <BiLogOut size={17} />
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
