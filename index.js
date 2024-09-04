import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import stripe from "stripe";




import { connectDB } from "./database/db.js";
import userRouter from "./routes/user.js";
import courseRouter from "./routes/course.js";
import adminRouter from "./routes/admin.js";

dotenv.config();
const app = express();
app.use(express.json());


app.use(function (req, res, next) {
   
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });
export const instance =stripe(process.env.STRIPE_SECRET)


app.use('/uploads', express.static( 'uploads'));

const port = process.env.PORT;

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/course", courseRouter);

app.listen(port, async () => {
    console.log("====================================");
    console.log(`Server is running on port ${port}`);
    console.log("====================================");
    await connectDB();
});
