import express from "express"
import { loginUser, myProfile, register, verifyUser } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
 const router = express.Router();

router.post("/register", register);
router.post("/verifyUser", verifyUser);
router.post("/loginUser", loginUser);
router.get("/myProfile", isAuth,myProfile);
export default router;