"use client";
import { UploadButton } from "@uploadthing/react";
import { FC } from "react";
import { OurFileRouter } from "../api/uploadthing/core";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton<OurFileRouter>
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
};

export default page;
