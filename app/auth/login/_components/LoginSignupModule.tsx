
import React from 'react';
import LoginSignup from './LoginSignup';

import {Metadata} from 'next';

interface Props {
    searchParams: URLSearchParams;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const tab = searchParams.get('tab') || 'login';

    const title = tab === 'register' ? 'Register for Vendify' : 'Login to Vendify';
    const description = tab === 'register'
        ? 'Create a new account to start using Vendify.'
        : 'Log in to your Vendify account to manage your sales and inventory.';

    return {
        title,
        description,
    };
}

const LoginSignupModule=({ searchParams }: Props) => {

  
  return (
    <div>
      <LoginSignup searchParams={searchParams} />
    </div>
  );
};

export default LoginSignupModule;
