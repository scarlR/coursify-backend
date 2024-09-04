import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import sendMail from "../middlewares/sendMail.js";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "user already exits",
            });
        }
        const hashPassword = await bcrypt.hash(password, 8);
        user = {
            name,
            email,
            password: hashPassword,
        };
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
        const activationToken = jwt.sign(
            {
                user,
                otp,
            },
            process.env.ACTIVATION_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        const data = {
            name,
            otp,
        };
        await sendMail(email, "Account Activation", data);
        res.status(201).json({
            message: "otp sent to mail",
            activationToken,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { otp, activationToken } = req.body;
      
        const verify = jwt.verify(
            activationToken,
            process.env.ACTIVATION_TOKEN_SECRET
        );
        
        if (!verify) {
            return res.status(400).json({
                message: "invalid token",
            });
        }

        if (verify.otp !== otp) {
            return res.status(400).json({
                message: "invalid otp or expired otp",
            });
        }
      
        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.password,
        });
        res.status(201).json({
            message: "user registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "problem in verifying user",
        });
    }
};

export const loginUser = async (req, res,next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user didn't exits",
            });
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({
                message: "either email or password is wrong",
            });
        }
        const token = jwt.sign({
            _id:user._id
        }, process.env.JWT_SECRET, {
            expiresIn:'10d'
        })
        res.status(200).json({
            message: `welcome back ${user.name}`,
            token,
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "problem in loging user",
        });
    }
};


export const myProfile = async (req, res) => {
 try {
    
     const user = await User.findById(req.user._id)
     
         return res.status(201).json({
             message: "my profile",
             user
         });

 } catch (error) {
   
        return res.status(403).json({
            message: "problem in myProfile",
        });

 }
};