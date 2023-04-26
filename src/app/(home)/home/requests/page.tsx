import { fetchRedis, getUsersById } from "@/app/helpers/redis";
import RequestsList from "@/components/RequestsList";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC } from "react";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const reqsIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:friend_requests`
  )) as string[];
  const userNames = await getUsersById(reqsIds);

  return (
    <div className="w-[60%] m-auto h-[80%]">
      <h1 className="text-3xl">Friend requests</h1>
      <div>
        <RequestsList
          sessionId={session.user.id}
          incomingRequests={userNames}
        />
      </div>
    </div>
  );
};

export default page;
