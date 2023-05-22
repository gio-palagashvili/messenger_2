"use client";
import { FC, useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import Button from "./ui/Button";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { pusherKey } from "@/lib/utils";

interface FriendRequestsProps {
  initialReqsCount: number;
  sessionId: string;
}

const FriendRequestsButton: FC<FriendRequestsProps> = ({
  initialReqsCount,
  sessionId,
}) => {
  const [reqs, setReqs] = useState<number>(initialReqsCount || 0);

  useEffect(() => {
    pusherClient.subscribe(pusherKey(`user:${sessionId}:friend_requests`));

    const handleFR = () => {
      setReqs((prev) => prev + 1);
    };
    const handleFrHere = () => {
      setReqs((prev) => prev - 1);
    };

    pusherClient.bind("friend_requests", handleFR);
    pusherClient.bind("friend_requests_accept", handleFrHere);

    return () => {
      pusherClient.unsubscribe(pusherKey(`user:${sessionId}:friend_requests`));
      pusherClient.unbind("friend_requests_accept", handleFrHere);

      pusherClient.unbind("friend_requests", handleFR);
    };
  }, []);

  return (
    <div className="indicator">
      <span
        className={
          reqs > 0
            ? "indicator-item indicator-top badge bg-red-main text-stone-900 font-bold text-xs"
            : ""
        }
      >
        {reqs || ""}
      </span>
      <Button>
        <FaUserFriends size={15} />
        requests
      </Button>
    </div>
  );
};

export default FriendRequestsButton;
