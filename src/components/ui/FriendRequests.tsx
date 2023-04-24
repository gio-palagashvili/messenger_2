"use client";
import { FC, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import Button from "./Button";

interface FriendRequestsProps {
  initialReqsCount: number;
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  initialReqsCount,
  sessionId,
}) => {
  const [reqs, setReqs] = useState<number>(initialReqsCount || 0);

  return (
    <div className="indicator">
      <span className="indicator-item indicator-top badge bg-red-main text-stone-900 font-bold text-xs">
        {reqs}
      </span>
      <Button>
        <FaUserFriends size={15} />
        requests
      </Button>
    </div>
  );
};

export default FriendRequests;
