import { TypeOf, z } from "zod";

export const messageValidator = z.object({
    id: z.string(),
    senderId: z.string(),
    recieverId: z.string(),
    text: z.string().min(1).max(1000),
    timestamp: z.number(),
})

export const groupMessageValidator = z.object({
    id: z.string(),
    sender: z.object({
        name: z.string(),
        email: z.string(),
        image: z.string(),
        id: z.string()
    }),
    text: z.string(),
    timestamp: z.number()
})

export const messagesValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;