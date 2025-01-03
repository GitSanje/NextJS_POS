// export {default } from "next-auth/middleware"

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server';

// // 1. Specify protected and public routes
const protectedRoutes = ['/dashboard','/profile', '/checkout','/order'];
const publicRoutes = ['/api/auth/signin', '/','products/*'];

export default async function middleware(req: NextRequest){
     // 2. Check if the current route is protected or public
     const path = req.nextUrl.pathname
     const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);
     
       // 3. Decrypt the session from the cookie
    const session = (await cookies()).get('next-auth.session-token')?.value;

    if(isProtectedRoute && !session ){
        return NextResponse.redirect(new URL('/api/auth/signin', req.nextUrl));
    }
    if(isPublicRoute && path==="/api/auth/signin" && session){
        return NextResponse.redirect(new URL('/',req.nextUrl));
    }
    

    return NextResponse.next();
}


// export const config = {
//     matcher: [
//         '/dashboard',
//         '/app/:path*'
//     ]
// }


// import { decrypt } from "./app/api/auth/stateless-session";







// export default async function middleware(req: NextRequest){
//     // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname;

//   const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//     // 3. Decrypt the session from the cookie
//     const cookie = cookies().get('next-auth.session-token')?.value;
//     const session = await decrypt(cookie);

//      // 4. Redirect
//   if (isProtectedRoute && !session?.userId) {
//     return NextResponse.redirect(new URL('/login', req.nextUrl));
//   }

//   if (
//     isPublicRoute &&
//     session?.userId &&
//     !req.nextUrl.pathname.startsWith('/dashboard')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
//   }

//   return NextResponse.next();

// }


// clerk middleware
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//     '/sign-in',
//     'sign-up',
//     // '/',
//     '/home'

// ])
// const isPublicApiRoute = createRouteMatcher([
//     '/api/videos',
// ])

// export default clerkMiddleware((auth, req) => {
//     const { userId } = auth()
//     const currUrl = new URL(req.url)
//    const isHomePage=  currUrl.pathname === '/home'
//    const isApiReq = currUrl.pathname.startsWith("/api")

//    // user logged in, not accessing home page
//    if(userId && isPublicRoute(req) && !isHomePage){
//     return NextResponse.redirect(new URL("/home", req.url))
//    }
//    //not logged in
//    if(!userId ){
//     if(!isPublicRoute(req) && !isPublicApiRoute(req)){
//      return NextResponse.redirect(new URL("/sign-in", req.url))
//     }

//     if(isApiReq && !isPublicApiRoute(req)){
//         return NextResponse.redirect(new URL("/sign-in", req.url))
//     }
//    }

// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };