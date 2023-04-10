import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"


const getENV = () => {
    const clientId = process.env.CLIENT_ID;
    const clientSectet = process.env.CLIENT_SECRET;

    if (!clientId || clientId.length == 0) throw new Error("check ENV file (CLIENT_ID)")
    if (!clientSectet || clientSectet.length == 0) throw new Error("check ENV file (CLIENT_SECRET)")

    return { clientId, clientSectet }
}
const _ = getENV();

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: _.clientId,
            clientSecret: _.clientSectet
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            const checkUser = await db.get(`user:${token.id}`) as User | null;
            if (checkUser) {
                return { id: checkUser.id, name: checkUser.name, email: checkUser.email }
            }
            // !idk
            token.id = user!.id
            return token;
        },
        async session({ session, token }) {

        }
    }
}