import mongoose from "mongoose"
import dns from "node:dns"

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
])
const connectDB= async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGO DB Connected Successfully!")
    } catch (error) {
        console.log("MONGO DB Connection Error!",error?.message)
        process.exit(1)
    }
}

export default connectDB;