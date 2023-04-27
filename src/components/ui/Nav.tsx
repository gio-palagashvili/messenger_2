import { Session, getServerSession } from "next-auth";
import Image from "next/image";
import { FC } from "react";
import Button from "@/components/ui/Button";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";
import { BsFillChatFill, BsPersonPlusFill } from "react-icons/bs";
import FriendRequestsButton from "@/components/ui/FriendRequestsButton";

interface NavProps {
  session: Session;
  initialReqsCount: number;
}

const Nav: FC<NavProps> = ({ session, initialReqsCount }) => {
  return (
    <div className="hidden min-w-[300px] h-full bg-off md:flex justify-center flex-col place-items-center ">
      <div className="h-[90%] w-full p-3">
        <div className="flex gap-1 justify-center">
          <Link href={"/home"}>
            <Button>
              <BsFillChatFill size={15} />
              chat
            </Button>
          </Link>
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
      <div className="flex gap-2 text-sm font-semibold justify-center place-items-center">
        <div className="relative h-9 w-9">
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
        <div className="flex gap-10 justify-center place-items-center">
          <div className="flex flex-col">
            <span aria-hidden="true" className="text-white">
              {session.user.name}
            </span>
            <span className="text-xs text-zinc-400" aria-hidden="true">
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
