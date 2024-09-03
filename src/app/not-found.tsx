// app/not-found.tsx
import { FC } from 'react';

const NotFound: FC = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-xl font-bold'>404 - Page Not Found</h1>
        <p className='text-gray-700'>The page you're looking for does not exist.</p>
        </div>
     
    </div>
  );
};

export default NotFound;
