import React, { useContext } from "react";
import header_image from "../assets/header_img.png";
import hand_wave from "../assets/hand_wave.png";
import { AuthContext } from "../context/authContext";

const Header = () => {
  const { isLoggedIn, navigate, userInfo } = useContext(AuthContext);
  return (
    <div>
      <div className="flex flex-col items-center gap-5 mt-[100px]">
        <img className="w-[100px] rounded-full" src={header_image} alt="" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-[1.5rem] flex items-center gap-2 font-medium">
            {`
            Hey ${
              isLoggedIn && userInfo ? userInfo.name.toUpperCase() : "Developer"
            }`}
            <img src={hand_wave} className="w-[30px]" alt="" />
          </p>
          <h2 className="text-[2.3rem] font-bold">Welcome to our app</h2>
          <p className="w-[80%] text-center">
            Let's start with a quick product tour and we will have you up and
            running in no time!
          </p>
        </div>
        <button
          type="button"
          className="border border-black/80 rounded-full px-6 py-2"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Header;
