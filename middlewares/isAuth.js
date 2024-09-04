import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
export const isAuth = async (req, res, next) => {
    try {
       
        const token = req.headers.token;
       
        if (!token) {
            return res.staus(403).json({
                message: "expired token",
            });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedUser._id);
      

        next();
    } catch (error) {
        return res.status(500).json({
            message: "problem in isAuth",
        });
    }
};
