import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(async function middleware(req) {
    const path = req.nextUrl.pathname;
    const authed = await getToken({ req });
    const sensitiveRoute = ["/home"];
    const isSensitive = sensitiveRoute.some(sensitiveRoute => path.startsWith(sensitiveRoute));

    if (path.startsWith("/login")) {
        if (authed) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
        return NextResponse.next();
    }
    if (!authed && isSensitive) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path == "/") {
        return NextResponse.redirect(new URL("/home", req.url));
    }
}, {
    callbacks: {
        async authorized() {
            return true;
        }
    }
})

export const config = {
    matchter: ['/', '/login', '/home/:path*']
}