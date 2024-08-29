// import { NextRequest, NextResponse } from 'next/server';

// export function middleware( req: NextRequest){
//     const accessToken = req.cookies.get('accessToken')?.value;

//     if (!accessToken) {
//         //const url = req.nextUrl.clone();
//         return NextResponse.redirect(new URL('/?tab=login', req.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['app/:path*'],
//   };