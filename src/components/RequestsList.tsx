"use client";
import Image from "next/image";
import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import Toast from "./ui/Toast";
import HandleToast from "./HandleToast";

interface RequestsListProps {
  incomingRequests: IncomingRequest[];
  sessionId: string;
}

const RequestsList: FC<RequestsListProps> = ({
  incomingRequests,
  sessionId,
}) => {
  const [incoming, setIncoming] = useState<IncomingRequest[]>(incomingRequests);

  const [error, setError] = useState<ToastError | null>(null);
  const [complete, setComplete] = useState<string | null>(null);

  const nav = useRouter();

  const acceptFriend = async (senderId: string) => {
    axios
      .post("/api/friends/accept", { id: senderId })
      .then((d) => {
        setComplete("Added a friend");
        setError(null);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        // setIncoming((prev) => prev.filter((r) => r.senderId != senderId));
        // nav.refresh();
      });
  };

  const rejectFriend = async (senderId: string) => {
    axios
      .post("/api/friends/reject", { id: senderId })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIncoming((prev) => prev.filter((r) => r.senderId != senderId));
        nav.refresh();
      });
  };

  return (
    <>
      <div className="flex flex-col gap-2 pt-2 overflow-y-scroll">
        {incoming.length > 0 ? (
          incoming.map((req, index) => {
            return (
              <div
                key={index}
                className="bg-off p-4 rounded-xl flex justify-between drop-shadow"
              >
                <div className="flex gap-2 justify-center place-items-center">
                  <div className="h-9 w-9 relative">
                    <Image
                      src={req.image}
                      alt="profile picture"
                      fill
                      sizes="100"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm">{req.name}</p>
                    <p className="text-xs text-main-color">{req.senderEmail}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    className="text-xs"
                    onClick={() => acceptFriend(req.senderId)}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => rejectFriend(req.senderId)}
                    variant={"ghostUnderline"}
                    className="text-xs"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No Friend requests yet.</p>
        )}
      </div>
      <HandleToast complete={complete} error={error} />
    </>
  );
};

export default RequestsList;
