import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import { axiosPrivate } from "./axios";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // 403 -> forbidden, potentially due to an expired access token
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          await refresh(); // Refresh the token (if needed, new cookie is set automatically)
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);
  return axiosPrivate;
};

export default useAxiosPrivate;
