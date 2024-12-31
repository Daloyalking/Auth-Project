import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, message: "You aren't authorized" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT);

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({ succes: false, message: "You aren't authorized" });
    }
    next();
  } catch (error) {
    return res.json({ succes: false, message: error.message });
  }
};

export default userAuth