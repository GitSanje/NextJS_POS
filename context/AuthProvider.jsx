import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(()=> {
        const checkAuth = async() => {
            try {
                const response = await ('http://localhost:3500/api/users/checkAuth',{ method: 'GET', credentials: 'include' })
                if (response.ok) {
                    const data = await response.json();
                    setAuth(data.user); // Store user info, not token
                    
                }else {
                    setAuth(null);
                }
                
            } catch (error) {
                console.error('Error checking authentication', error);
                setAuth(null);
            }
        }

        checkAuth();
    },[])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;