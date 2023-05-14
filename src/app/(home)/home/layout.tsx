import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Nav from "@/components/ui/Nav";
import { fetchRedis } from "@/app/helpers/redis";

export const metadata = {
  title: "Messenger",
  description: "messenger app main page",
};

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const initialReqsCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="w-full h-full flex">
      <Nav session={session} initialReqsCount={initialReqsCount} />
      {children}
    </div>
  );
};

export default Layout;
