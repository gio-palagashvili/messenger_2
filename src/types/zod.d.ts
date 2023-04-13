import { validateFriend } from "@/lib/validators/addFriend";
import { z } from "zod";

export type FormData = z.infer<typeof validateFriend>