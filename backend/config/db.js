
import mongoose from "mongoose";

// Cache the Mongoose connection globally for serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Prevents Vercel from exhausting MongoDB connections
    };

    const uri = process.env.MONGO_URI || "mongodb+srv://alihusnain_db:ali123456@portfolio.cqdodyf.mongodb.net/?appName=Portfolio";

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log("MongoDB Connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`Error connecting to MongoDB: ${e.message}`);
    
    // Do NOT call process.exit(1) on Vercel as it triggers FUNCTION_INVOCATION_FAILED
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw e;
  }

  return cached.conn;
};

export default connectDB;