

import { toast } from "react-toastify";
import LoginSignup from "./auth/login/_components/LoginSignup";
import { useSearchParams } from 'next/navigation';

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { User } from "./user";
import { LoginButton, LogoutButton } from './auth'


// import { useEffect } from "react";


// next-auth session data 


export default async function Home() {

  // const searchParams = useSearchParams();
  // const isLoggedIn = searchParams.get('loggedIn');
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     toast.success('Logged in successfully!', {
  //       autoClose:2000
  //     });
  //   }
  // }, [isLoggedIn]);
  const session = await getServerSession(authOptions)
  return (
    <>
     {/* <LoginSignup searchParams={SearchParams}/>
     */}
      <LoginButton />
      <LogoutButton />
      <h2>Server Call</h2>
     <pre>{JSON.stringify(session)}</pre>
     <h2>Client Call</h2>
     <User/>
    
     </>
  
  );
}


// clerk session data 
// import { auth, currentUser } from '@clerk/nextjs/server'

// export default async function Page() {
//   // Get the userId from auth() -- if null, the user is not signed in
//   const { userId } = auth()
//   console.log(userId,'userid');
  

//   if (userId) {
//     // Query DB for user specific information or display assets only to signed in users
//   }

//   // Get the Backend API User object when you need access to the user's information
//   const user = await currentUser()
//   // Use `user` to render user details or create UI elements

//   return <>
//   <pre> { JSON.stringify(user)}</pre>
  
//   </>
// }
