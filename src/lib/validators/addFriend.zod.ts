import { z } from "zod"

export const validateFriend = z.object({
    email: z.string().email()
});