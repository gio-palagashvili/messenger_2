"use client";
import { FC, useState } from "react";

interface RequestsListProps {
  incomingRequests: IncomingRequest[];
  sessionId: string;
}

const RequestsList: FC<RequestsListProps> = ({
  incomingRequests,
  sessionId,
}) => {
  const [incoming, setIncoming] = useState<IncomingRequest[]>(incomingRequests);

  return (
    <>
      {incoming.map((reuqest, index) => {
        <div>{reuqest.senderEmail} index</div>;
      })}
    </>
  );
};

export default RequestsList;
