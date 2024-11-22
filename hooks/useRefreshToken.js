
import useAuth from './useAuth';
import axios from "./axios";

const useRefreshToken = () => {

    const { setAuth } = useAuth();
  const refresh = async () => {
    try {
        const response = await axios.post("http://localhost:3500/api/users/refresh", {}, {
            withCredentials: true,
          });
        // setAuth(prev => ({
        //     ...prev,
        //     user: response.data.user
        // }));
        
    } catch (error) {
        console.error('Error refreshing token', error);
        // setAuth(null);
    }


  }
    
  return refresh

  
}

export default useRefreshToken