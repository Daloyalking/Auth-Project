import authModel from "../models/authModel.js";

export const userData = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await authModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User can't be found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {}
};
