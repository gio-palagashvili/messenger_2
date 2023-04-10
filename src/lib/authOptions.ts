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
const googleENV = getENV();

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
            clientId: googleENV.clientId,
            clientSecret: googleENV.clientSectet
        })
    ]
}