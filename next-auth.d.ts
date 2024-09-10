import { UserRole } from "@prisma/client";
import { User } from "next-auth";

type UserId = string
declare module 'next-auth/jwt' {
    interface JWT {
            id: UserId
            role:UserRole
        

    }
}
declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId
            role:UserRole
        }

    }

    interface Profile{
        id: string,
        role: UserRole,
        picture: string | null
    }
}