import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions);