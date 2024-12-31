import React, { useContext } from "react";
import logo from "../assets/logo.svg";
import arrow_icon from "../assets/arrow_icon.svg";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const {
    isLoggedIn,
    navigate,
    userInfo,
    backendurl,
    setIsLoggedIn,
    setUserInfo,
  } = useContext(AuthContext);

  const Logout = async () => {
    try {
      const { data } = await axios.post(backendurl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const sentOtp = async () => {
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(backendurl + "/api/auth/send-verify");
      if (data.success) {
        setIsLoggedIn(true);
        toast.success("Otp sent to your email");
        navigate("/email-verify");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mx-[5%] py-5">
      <div className="flex items-center justify-between">
        <img
          onClick={() => navigate("/")}
          src={logo}
          className="w-[100px] md:w-[120px]"
          alt="logo image"
        />
        {!isLoggedIn && (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-black/80 rounded-full px-3 py-1 text-[10px] md:text-[16px]"
          >
            Login
            <img className=" w-[10px] md:w-[10px]" src={arrow_icon} alt="" />
          </button>
        )}
        {isLoggedIn && userInfo && (
          <div className="bg-slate-500 rounded-full  group relative w-10 h-10 flex items-center justify-center">
            <p className="">{userInfo.name.slice(0, 1).toUpperCase()}</p>

            <div className="absolute  top-full right-0 mt-2 w-[120px] bg-slate-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              {!userInfo.isAccountVerified && (
                <p
                  className="px-4 py-2 hover:bg-blue-600 cursor-pointer rounded-lg"
                  onClick={sentOtp}
                >
                  Verify email
                </p>
              )}
              <p
                onClick={Logout}
                className="px-4 py-2 hover:bg-blue-600 cursor-pointer rounded-lg"
              >
                Logout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
