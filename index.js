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

// app.use(
//   cors({
//     origin: "*", 
//     credentials: true, // Allow cookies to be sent with requests
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: [
//       "Origin",
//       "Content-Type",
//       "Accept",
//       "Authorization",
//       "X-Requested-With",
//     ],
//   })
// );

app.options("*", cors({ origin: '*', optionsSuccessStatus: 200 }));

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

// app.options('*', cors());


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
