import axios from "axios";
import { Children, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const backendurl = "http://localhost:4000";
  const navigate = useNavigate();

  const getUserAuth = async () => {
    try {
      const { data } = await axios.post(backendurl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        fetchUserData();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendurl + "/api/user/user-data");
      console.log(data);
      setUserInfo(data.userData);
    } catch (error) {
      console.log("Error occur while fetching data");
    }
  };

  useEffect(() => {
    getUserAuth();
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    backendurl,
    navigate,
    fetchUserData,
    userInfo,
    loading,
    setLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContextProvider;
