import authModel from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "All details are required, please provide them",
    });
  }

  try {
    const userExist = await authModel.findOne({ email });

    if (userExist) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);
    const newuser = new authModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newuser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: none,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    try {
      const mailOptions = {
        from: `<$(process.env.SENDER_EMAIL)>`,
        to: email,
        subject: "Welcome to Daloyalking Techy",
        text: `Welcome to Daloyalking Techy. Your account has been created with email id: ${email}`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error.message);
    }

    return res.json({ success: true, message: "Account created" });
  } catch (error) {
    res.json({ success: false, message: "Error signing up a new user" });
  }
};
export const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "All details are required, please provide them",
    });
  }
  try {
    const userExist = await authModel.findOne({ email });
    const passwordDecode = await bcrypt.compare(password, userExist.password);

    if (!userExist) {
      return res.json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (!passwordDecode) {
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }
    const token = jwt.sign({ id: userExist._id }, process.env.JWT, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: none,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    try {
      const mailOptions = {
        from: `<$(process.env.SENDER_EMAIL)>`,
        to: email,
        subject: "Welcome to Daloyalking Techy",
        text: `You are welcome back to Daloyalking Techy. Explore our website to see all the features on it. I'm very sure that you are going to love it.`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error.message);
    }

    res.json({ success: true, message: "User is logged in" });
  } catch (error) {
    res.json({ success: false, message: "Error logging in" });
  }
};

export const Logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await authModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User can't be found" });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account has been verified already",
      });
    }
    const otp = String(Math.floor(200000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    try {
      const mailOptions = {
        from: `<$(process.env.SENDER_EMAIL)>`,
        to: user.email,
        subject: "Verify your Daloyalking Techy Account",
        html: `Your otp is <b style="color:red">${otp}</b>. Verify your account using the otp and the otp is only valid for 24hrs`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error.message);
    }

    res.json({
      success: true,
      message: "Otp sent",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await authModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User can't be found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid Otp" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Otp expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    res.json({ success: true, message: "Email verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true, message: "You are authenticated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resetAccountOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email field can't be left empty",
    });
  }

  try {
    const user = await authModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 4 * 60 * 1000;

    await user.save();

    try {
      const mailOptions = {
        from: `<$(process.env.SENDER_EMAIL)>`,
        to: user.email,
        subject: "Reset your Daloyalking Techy Account Password",
        html: `Your otp is <b style="color:red">${otp}</b>. Reset your account using the otp and the otp is only valid for 4mins`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error.message);
    }

    res.json({ success: true, message: "Password reset Otp sent" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.json({ success: false, message: "You haven't entered any otp" });
  }
  try {
    const reset = await authModel.findOne({ resetOtp: otp });
    console.log(reset);
    if (!reset) {
      return res.json({
        success: false,
        message: "Otp is not valid",
      });
    }
    if (reset.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "Otp has expired",
      });
    }
    if (reset.resetOtp === "" || otp !== reset.resetOtp) {
      return res.json({
        success: false,
        message: "Otp is not correct",
      });
    }
    res.json({ success: true, message: "Reset Otp verified" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyResetAccount = async (req, res) => {
  const { email, newPassword1, newPassword2 } = req.body;

  if (!email || !newPassword1 || !newPassword2) {
    return res.json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    if (newPassword1 !== newPassword2) {
      return res.json({ success: false, message: "Passwords doesn't match" });
    }

    const hashNewPassword = await bcrypt.hash(newPassword1, 10);

    user.password = hashNewPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await authModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "OTP cannot be sent to this email",
      });
    }

    if (user.resetOtpExpireAt > Date.now()) {
      return res.json({
        success: false,
        message: "OTP hasn't expired",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 4 * 60 * 1000;

    await user.save();

    try {
      const mailOptions = {
        from: `<$(process.env.SENDER_EMAIL)>`,
        to: user.email,
        subject: "Reset your Daloyalking Techy Account Password",
        html: `Your otp is <b style="color:red">${otp}</b>. Reset your account using the otp and the otp is only valid for 4mins`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error.message);
    }

    res.json({
      success: true,
      message: "New otp has been sent to your email id",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error occur while sending otp",
    });
  }
};
