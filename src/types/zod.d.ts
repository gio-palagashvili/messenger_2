import { validateFriend } from "@/lib/validators/addFriend.zod";
import { z } from "zod";

export type FormData = z.infer<typeof validateFriend>