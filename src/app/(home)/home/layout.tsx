import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";
import Button from "@/components/ui/Button";
interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <div>
      {children}

      <div className="flex gap-10">
        <Link href={"/home"}>
          <Button>home</Button>
        </Link>
        <Link href={"home/add"}>
          <Button>Add a friend</Button>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
