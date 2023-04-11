import type { Session, User } from "next-auth"
import { JWT } from "next-auth/jwt";

type UserId = string
// !
declare module 'next-auth/jwt' {
    interface JWT {
        id: string
    }
}

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: string
        }
    }
}