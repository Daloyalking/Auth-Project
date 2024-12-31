import React, { useContext, useEffect, useRef } from "react";
import logo from "../assets/logo.svg";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const { isLoggedIn, backendurl, navigate, fetchUserData, userInfo } =
    useContext(AuthContext);

  const inputRefs = useRef([]);

  const onInputHandler = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const keydownHandler = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "") {
      inputRefs.current[index - 1].focus();
      return;
    }
    if (e.key === "ArrowLeft") {
      inputRefs.current[index - 1].focus();
      return;
    }
    if (e.key === "ArrowRight") {
      inputRefs.current[index + 1].focus();
      return;
    }
  };

  const pasteHandler = (e) => {
    const pasteArray = e.clipboardData.getData("text").split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const verifyEmail = async (e) => {
    axios.defaults.withCredentials = true;
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otp = otpArray.join("");

    const { data } = await axios.post(backendurl + "/api/auth/verify", { otp });

    if (data.success) {
      toast.success("Email Verified  Successfully");
      fetchUserData();
      navigate("/");
    }
  };

  useEffect(() => {
    isLoggedIn && userInfo && userInfo.isAccountVerified && navigate("/");
  }, [userInfo, isLoggedIn]);

  return (
    <div>
      <div className="h-screen px-[5%] pt-[2%] relative bg-gradient-to-br from-blue-200 to-purple-400">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer"
          src={logo}
          alt=""
        />
        <div className="bg-slate-900 p-8 rounded-lg text-indigo-300 w-[80%] md:w-[25%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <p className="text-center text-white text-[1.5rem] font-bold">
            Email Verify OTP
          </p>
          <p className="text-center text-[14px]">
            Enter the 6-digit code sent to your email
          </p>
          <div
            className="flex items-center gap-2 mb-5 mt-5"
            onPaste={pasteHandler}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  className="w-[40px] h-[40px] text-center text-black text-[1.2rem]"
                  type="text"
                  maxLength={1}
                  required
                  key={index}
                  name=""
                  id={index}
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => onInputHandler(e, index)}
                  onKeyDown={(e) => keydownHandler(e, index)}
                />
              ))}
          </div>
          <button
            type="submit"
            onClick={verifyEmail}
            className={`bg-gradient-to-br from-indigo-400 to-indigo-800 w-full text-white py-1 rounded-full`}
          >
            Verify email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
