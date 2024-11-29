import { authConfig } from "@/app/lib/auth";
import NextAuth from "next-auth/next";

const hanler = NextAuth(authConfig);

export { hanler as GET, hanler as POST }