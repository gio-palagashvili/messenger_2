import { Session } from "next-auth";
import Image from "next/image";
import { FC } from "react";
import Button from "@/components/ui/Button";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";
import { BsFillChatFill, BsPersonPlusFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";

interface NavProps {
  session: Session;
}

const Nav: FC<NavProps> = ({ session }) => {
  return (
    <div className="hidden w-[300px] h-full bg-zinc-800 md:flex justify-center flex-col place-items-center ">
      <div className="h-[90%] w-full p-3">
        <div className="flex gap-1 justify-center">
          <Link href={"/home"}>
            <Button>
              <BsFillChatFill size={15} />
              chat
            </Button>
          </Link>
          <Link href={"home/requets"}>
            <Button>
              <FaUserFriends size={15} />
              requests
            </Button>
          </Link>
          <Link href={"home/add"}>
            <Button>
              <BsPersonPlusFill size={15} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex gap-2 text-sm font-semibold">
        <div className="relative h-9 w-9">
          <Image
            referrerPolicy="no-referrer"
            className="rounded-full"
            placeholder="empty"
            fill={true}
            src={session.user.image as string}
            alt="Your profile picture"
          />
        </div>
        <div className="flex gap-10">
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
