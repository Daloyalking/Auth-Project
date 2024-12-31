import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import person_icon from "../assets/person_icon.svg";
import mail_icon from "../assets/mail_icon.svg";
import lock_icon from "../assets/lock_icon.svg";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";

const Login = () => {
  const {
    setIsLoggedIn,
    backendurl,
    loading,
    setLoading,
    navigate,
    fetchUserData,
  } = useContext(AuthContext);
  const [loginState, setLoginState] = useState("login");
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (loginState === "login") {
      if (loginData.email === "" || loginData.password === "") {
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.post(backendurl + "/api/auth/login", {
          email: loginData.email,
          password: loginData.password,
        });
        console.log(data);
        if (data.success) {
          setIsLoggedIn(true);
          fetchUserData();
          navigate("/");
        } else {
          toast.error(
            "Error occur, ensure your email and password are correct"
          );
          console.log("Error occur while logging in");
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (
        loginData.name === "" ||
        loginData.email === "" ||
        loginData.password === ""
      ) {
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.post(backendurl + "/api/auth/register", {
          name: loginData.name,
          email: loginData.email,
          password: loginData.password,
        });
        console.log(data);
        if (data.success) {
          setIsLoggedIn(true);
          fetchUserData();
          navigate("/");
        } else {
          toast.error(
            "Error occur, ensure your email and password are correct"
          );
          console.log("Error occur while logging in");
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen px-[5%] pt-[2%] relative bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="">
        <img onClick={() => navigate("/")} src={logo} alt="" />
        <div className="bg-slate-900 p-8 rounded-lg text-indigo-300 w-[80%] md:w-[25%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <p className="text-center text-white text-[1.5rem] font-bold">
            {loginState === "signup" ? "Create Account" : "Login"}
          </p>
          <p className="text-center text-[14px]">
            {loginState === "signup"
              ? "Create your account"
              : "Login to your account"}
          </p>
          <form
            onSubmit={onSubmitHandler}
            action=""
            className="flex flex-col gap-4 mt-5"
          >
            {loginState === "signup" && (
              <div className="flex items-center bg-[#333a5c] pl-4 py-2 rounded-full">
                <img src={person_icon} alt="" />

                <input
                  type="text"
                  className="bg-transparent text-[12px] outline-none border-none pl-2"
                  name=""
                  id=""
                  placeholder="Full Name"
                  value={loginData.name}
                  onChange={(e) =>
                    setLoginData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
            )}
            <div className="flex items-center bg-[#333a5c] pl-4 py-2 rounded-full">
              <img src={mail_icon} alt="" />
              <input
                type="email"
                className="bg-transparent text-[12px] outline-none border-none pl-2"
                name=""
                id=""
                placeholder="Email Id"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center bg-[#333a5c] pl-4 py-2 rounded-full">
              <img src={lock_icon} alt="" />
              <input
                type="password"
                className="bg-transparent text-[12px] outline-none border-none pl-2"
                name=""
                id=""
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
          </form>
          <p
            onClick={() => navigate("/reset-password")}
            className="mt-3 mb-3 cursor-pointer text-indigo-400"
          >
            Forgot password?
          </p>
          <button
            type="submit"
            onClick={onSubmitHandler}
            className={`${
              loading ? "bg-gray-500" : "bg-gradient-to-br"
            }  from-indigo-400 to-indigo-800 w-full text-white py-1 rounded-full`}
          >
            {loginState === "signup"
              ? `${loading ? "Loading..." : "Sign Up"}`
              : `${loading ? "Loading..." : "Login"}`}
          </button>

          {loginState === "signup" && (
            <p className="text-[12px] mt-3 text-center">
              Already have an account?{" "}
              <span
                onClick={() => setLoginState("login")}
                className="text-blue-400 underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          )}
          {loginState !== "signup" && (
            <p className="text-[14px] mt-3 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => setLoginState("signup")}
                className="text-blue-400 underline cursor-pointer"
              >
                Sign up{" "}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
