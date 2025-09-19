import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1); //1 emans failure
    }
}