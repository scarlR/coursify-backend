import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("db is connected");
        
    } catch (error) {
        console.log("error in connecting to DB")
    }
}
