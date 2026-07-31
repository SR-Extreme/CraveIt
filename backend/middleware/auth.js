import jwt from "jsonwebtoken";
import { TOKEN_COOKIE } from "../utils/authCookie.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.[TOKEN_COOKIE];
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default authMiddleware;
