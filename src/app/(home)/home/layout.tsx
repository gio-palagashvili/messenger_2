import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import SignOutButton from "@/components/SignOutButton";
import Image from "next/image";
interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  console.log(session);
  return (
    <div>
      <div className="flex flex-1 items-center gap-x-4 p-3 text-sm font-semibold  text-gray-900">
        <div className="relative h-8 w-8 bg-gray-50">
          <Image
            fill
            referrerPolicy="no-referrer"
            className="rounded-full"
            src={session.user.image || ""}
            alt="Your profile picture"
          />
        </div>

        <div className="flex flex-col">
          <span aria-hidden="true">{session.user.name}</span>
          <span className="text-xs text-zinc-400" aria-hidden="true">
            {session.user.email}
          </span>
        </div>
      </div>
      {children}
      {/* <div className="flex gap-1 mt-10">
        <Link href={"/home"}>
          <Button>Home</Button>
        </Link>
        <Link href={"home/add"}>
          <Button>Add a friend</Button>
        </Link>
        <SignOutButton>Sign out</SignOutButton>
      </div> */}
    </div>
  );
};

export default Layout;
