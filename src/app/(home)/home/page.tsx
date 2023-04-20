import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FC } from "react";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  return <div className=""></div>;
};

export default page;
