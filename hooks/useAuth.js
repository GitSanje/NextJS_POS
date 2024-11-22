import AuthContext from "../context/AuthProvider";
import React, { useContext } from 'react'


const useAuth = () => {

    //const { auth, setAuth} = useContext(AuthContext);
    //useDebugValue(auth, auth => auth ? "Logged In" : "Logged Out")
  return useContext(AuthContext);
  
}

export default useAuth
