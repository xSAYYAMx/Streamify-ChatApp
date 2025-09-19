import { StreamChat } from "stream-chat";
import "dotenv/config"

const apiKey= process.env.STREAM_API_KEY;
const apiSecret= process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.log("Stream API key or Secret is missing")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData); //either create if not present or update
        return userData;
    } catch (error) {
        console.error("Error upserting stream user ", error);
    }
}

// TODO: do it later
export const generateStreamToken = (userId) => {
    try {
        //ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.error("Error generating stream token")
    }
}