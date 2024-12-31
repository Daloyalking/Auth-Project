import React, { useContext, useRef, useState } from "react";
import logo from "../assets/logo.svg";
import mail_icon from "../assets/mail_icon.svg";
import lock_icon from "../assets/lock_icon.svg";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { loading, setLoading, backendurl, navigate, fetchUserData, userInfo } =
    useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

  const handleResetEmail = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true);
      const { data } = await axios.post(backendurl + "/api/auth/reset-otp", {
        email,
      });
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    return;
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true);
      const { data } = await axios.post(
        backendurl + "/api/auth/resend-reset-otp",
        {
          email,
        }
      );
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    return;
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    const otpArray = inputRefs.current.map((e) => e.value);
    const otpF = otpArray.join("");

    try {
      setLoading(true);
      const { data } = await axios.post(
        backendurl + "/api/auth/verify-reset-otp",
        {
          otp: otpF,
        }
      );

      if (data.success) {
        setIsEmailSent(true);
        setIsOtpSubmitted(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    return;
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true);
      const { data } = await axios.post(backendurl + "/api/auth/verify-reset", {
        email,
        newPassword1,
        newPassword2,
      });
      console.log(data);
      if (data.success) {
        setIsEmailSent(true);
        setIsOtpSubmitted(true);
        toast.success(data.message);
        setEmail("");
        setOtp("");
        navigate("/login");
      } else {
        toast.error(data.message);
        navigate("/reset-password");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    return;
  };

  return (
    <div className="w-full">
      <div className="h-screen relative w-full px-[5%] pt-[2%] bg-gradient-to-br from-blue-200 to-purple-400">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer"
          src={logo}
          alt=""
        />
        <div className="flex items-center justify-center md:w-[40%] mx-auto mt-[40%] md:mt-[10%] ">
          {/* Email Sent Section */}

          {!isEmailSent && (
            <div className="bg-slate-900 p-8 rounded-lg text-indigo-300 w-full">
              <p className="text-center text-white text-[1.5rem] font-bold">
                Reset Password
              </p>
              <p className="text-center text-[14px]">
                Enter your registered email address
              </p>

              <div className="flex items-center bg-[#333a5c] pl-4 py-2 rounded-full mt-5">
                <img src={mail_icon} alt="" />
                <input
                  type="email"
                  className="bg-transparent text-[12px] outline-none border-none pl-2"
                  name=""
                  id=""
                  placeholder="Email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="mt-2" onClick={() => navigate("/login")}>
                Remembered your password?
                <span className="text-blue-400 underline cursor-pointer">
                  {" "}
                  Try login in
                </span>
              </p>

              <button
                type="submit"
                onClick={handleResetEmail}
                className={`${
                  loading ? "bg-[#333a5c]" : "bg-gradient-to-br"
                }  from-indigo-400 to-indigo-800 w-full text-white py-1 rounded-full mt-5`}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          )}

          {/* Otp Sent Section */}
          {!isOtpSubmitted && isEmailSent && (
            <div className="bg-slate-900  p-8 rounded-lg text-indigo-300  ">
              <p className="text-center text-white text-[1.5rem] font-bold">
                Reset Password OTP
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

              <p className="mt-2 mb-2" onClick={handleResendOtp}>
                OTP expired?
                <span className="text-blue-400 underline cursor-pointer">
                  {" "}
                  Resend OTP
                </span>
              </p>
              <button
                type="submit"
                onClick={handleOtp}
                className={`${
                  loading ? "bg-[#333a5c]" : "bg-gradient-to-br"
                } from-indigo-400 to-indigo-800 w-full text-white py-1 rounded-full`}
              >
                {loading ? "Loading..." : "Verify"}
              </button>
            </div>
          )}

          {/* Reset Password Section */}
          {isOtpSubmitted && isEmailSent && (
            <div className="bg-slate-900 p-8 rounded-lg text-indigo-300 w-[80%]">
              <p className="text-center text-white text-[1.5rem] font-bold">
                New Password
              </p>
              <p className="text-center text-[14px]">
                Enter the new password below
              </p>

              <div className="flex items-center bg-[#333a5c] pl-4 py-2 rounded-full mt-5">
                <img src={lock_icon} alt="" />
                <input
                  type="password"
                  className="bg-transparent text-[12px] outline-none border-none pl-2"
                  name=""
                  id=""
                  placeholder="Enter Password"
                  value={newPassword1}
                  onChange={(e) => setNewPassword1(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-[#333a5c] pl-4 py-2 rounded-full mt-5">
                <img src={lock_icon} alt="" />
                <input
                  type="password"
                  className="bg-transparent text-[12px] outline-none border-none pl-2"
                  name=""
                  id=""
                  placeholder="Confirm your password"
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                />
              </div>

              <button
                type="submit"
                onClick={resetPassword}
                className={`${
                  loading ? "bg-[#333a5c]" : "bg-gradient-to-br"
                } from-indigo-400 to-indigo-800 w-full text-white py-1 rounded-full mt-5`}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
