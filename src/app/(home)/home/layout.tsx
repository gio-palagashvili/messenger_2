import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import SignOutButton from "@/components/SignOutButton";
interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div>
      {children}
      <div className="flex gap-1 mt-10">
        <Link href={"/home"}>
          <Button>Home</Button>
        </Link>
        <Link href={"home/add"}>
          <Button>Add a friend</Button>
        </Link>
        <SignOutButton>Sign out</SignOutButton>
      </div>
    </div>
  );
};

export default Layout;
