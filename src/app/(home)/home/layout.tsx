import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Nav from "@/components/ui/Nav";
interface LayoutProps {
  children: ReactNode;
}
export const metadata = {
  title: "Messenger",
  description: "messenger app main page",
};

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="w-full h-full flex">
      <Nav session={session} />
      {children}
    </div>
  );
};

export default Layout;
