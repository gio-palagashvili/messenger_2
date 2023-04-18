import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"

const getENV = () => {
    const clientId = process.env.CLIENT_ID;
    const clientSectet = process.env.CLIENT_SECRET;

    if (!clientId || clientId.length == 0) console.log("check ENV file (CLIENT_ID)")
    if (!clientSectet || clientSectet.length == 0) console.log("check ENV file (CLIENT_SECRET)")

    return { clientId, clientSectet }
}

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
            clientId: getENV().clientId!,
            clientSecret: getENV().clientSectet!
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            const checkUser = await db.get(`user:${token.id}`) as User | null;
            if (checkUser) {
                return { id: checkUser.id, name: checkUser.name, email: checkUser.email }
            }
            token.id = user!.id
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session;
        },
        // redirect({ baseUrl, url }) {
        //     return "/home"
        // }
    }
}