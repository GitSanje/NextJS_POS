
import { useFormStatus } from "react-dom";
import Button from "../../../../components/Button/Button";


import React from 'react'

const SignUpButton: React.FC = () => {
    const { pending } = useFormStatus();
  
    return (
      <Button aria-disabled={pending} type="submit"  className="w-full bg-indigo-500 text-white py-2 rounded-lg ">
        {pending ? 'Submitting...' : 'Signup'}
      </Button>
    );
}

export default SignUpButton

