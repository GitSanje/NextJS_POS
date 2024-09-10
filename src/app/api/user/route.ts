import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../vendor/prisma";
import { error } from "console";


export const GET = async(req: NextRequest) => {
    const userId = req.nextUrl.searchParams.get("userId")
  
    

    try {

        const user = await prisma.user.findUnique({
            omit: {
                password: true,
                Cart: true,
                orders: true
            },
            where: {
                id: userId as string
            },
           
        
        })
        if(!user){
            return NextResponse.json({ error:"user does not exists" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
        
        
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get user " },
            { status: 500 }
          );
        
    }}

