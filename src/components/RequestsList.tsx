"use client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import axios from "axios";
import HandleToast from "./HandleToast";
import { twMerge } from "tailwind-merge";
import { pusherClient } from "@/lib/pusher";
import { Session } from "next-auth";
import { pusherKey } from "@/lib/utils";

interface RequestsListProps {
  incomingRequests: IncomingRequest[];
  session: Session;
}

const RequestsList: FC<RequestsListProps> = ({ incomingRequests, session }) => {
  const [incoming, setIncoming] = useState<IncomingRequest[]>(incomingRequests);

  const [error, setError] = useState<ToastError | null>(null);
  const [complete, setComplete] = useState<string | null>(null);
  const [loading, setLoading] = useState<Loading>({ isLoading: false });

  useEffect(() => {
    pusherClient.subscribe(
      pusherKey(`user:${session.user.id}:friend_requests`)
    );

    const handleFR = (sender: IncomingRequest) => {
      setIncoming((prev) => [...prev, sender]);
    };
    pusherClient.bind("friend_requests", handleFR);
    return () => {
      pusherClient.unsubscribe(
        pusherKey(`user:${session.user.id}:friend_requests`)
      );
      pusherClient.unbind("friend_requests", handleFR);
    };
  }, []);

  const acceptFriend = async (senderId: string, index: number) => {
    setLoading({ isLoading: true, index: index });
    axios
      .post("/api/friends/accept", { id: senderId })
      .then((d) => {
        setComplete(d.data);
        setError(null);
      })
      .catch((err) => {
        setError({ text: err.response.data, index: index });
      })
      .finally(() => {
        setLoading({ isLoading: false, index: index });
        setIncoming((prev) => prev.filter((r) => r.senderId != senderId));
        window.location.reload();
      });
  };

  const rejectFriend = async (senderId: string, index: number) => {
    setLoading({ isLoading: true, index: index });
    axios
      .post("/api/friends/reject", { id: senderId })
      .then((d) => {
        setComplete(d.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading({ isLoading: false, index: index });
        setIncoming((prev) => prev.filter((r) => r.senderId != senderId));
        window.location.reload();
      });
  };

  return (
    <>
      <div className="flex flex-col gap-2 pt-2 overflow-y-scroll">
        {incoming.length > 0 ? (
          incoming.map((req, index) => {
            const style = twMerge(
              "bg-off p-4 rounded-xl flex justify-between drop-shadow",
              index == loading.index ? "animate-pulse" : ""
            );
            return (
              <div key={index} className={style}>
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
                    onClick={() => acceptFriend(req.senderId, index)}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => rejectFriend(req.senderId, index)}
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
          <p className="text-zinc-400">Nothing to show here.</p>
        )}
      </div>
      <HandleToast complete={complete} error={error} />
    </>
  );
};

export default RequestsList;
