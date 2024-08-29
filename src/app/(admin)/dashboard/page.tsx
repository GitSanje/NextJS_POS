

//import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import React,{useEffect} from 'react'
import { authOptions } from '../../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { signIn, signOut } from 'next-auth/react'
import Button from '../../../components/Button/Button'

import { useSearchParams } from 'next/navigation';

const page:React.FC = async () => {

 

  const session = await getServerSession(authOptions)
  if( session?.user.role !== "ADMIN"){
    // throw new Error("you need to be an admin")
    return <>
    <h2> you need to be an admin </h2>
    </>
  }

  // if(!session){
  //  redirect('api/auth/signin')
  // }

  // client side protection
  // const {status} = useSession({
  //   required:true,
  //   onUnauthenticated(){
  //     console.log('Not logged in');
      
  //   }
  // })

  // if(status === "loading"){
  //   return " loading or unauthenticated"
  // }

  return (
    <div>Admin dashboard

    <Button
    onClick={() => signOut()}>
      Log Out
    </Button>


    </div>
  )
}

export default  page