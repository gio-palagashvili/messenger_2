import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { FC } from "react";

const page = async ({}) => {
  const session = await getServerSession(authOptions);

  return <div>{JSON.stringify(session)}</div>;
};

export default page;
