
'use client'
import LoginSignupModule from './_components/LoginSignupModule';
import { useSearchParams } from 'next/navigation';



  export default function Page() {
    const searchParams = useSearchParams()
    return <LoginSignupModule searchParams={searchParams} />;
  }
