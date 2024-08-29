
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';


const withAuth = (WrappedComponent: React.ComponentType) => {

const Wrapper : React.FC<any> = (props) => {
    const router = useRouter();

    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('user')

    useEffect(() => {

        setTimeout(() => {
            if(!isAuthenticated){
                router.push("/?tab=login")
            }
        }, 1000)
     
    },[isAuthenticated,router])

    if (!isAuthenticated) {
        return (
            <div className='text-lg bg-white text-black fond bold flex items-center justify center'> 
            You are not login</div>
        ); 
      }


    return <WrappedComponent {...props} />;

}

  return Wrapper;
    
  
}

export default withAuth