const mongoose = require('mongoose');

// FETCHING ATLAS_DB URL
let dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
  console.error("CRITICAL ERROR: No Database URL found!");
  process.exit(1);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.ATLASDB_URL, {
            serverSelectionTimeoutMS: 10000,
            heartbeatFrequencyMS: 30000,
        });
        console.log(` MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

module.exports = connectDB;