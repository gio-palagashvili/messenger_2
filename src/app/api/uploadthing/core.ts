import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// const session = await getServerSession(authOptions);
// if (!session) throw new Error("Unauthorized");

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            //metadata
            return { userId: 'session.user.id' };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
        }),
    mediaPost: f({
        image: { maxFileSize: "2MB", maxFileCount: 4 },
    })
        .onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;