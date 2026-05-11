const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to DB')
    } catch (error) {
        console.log(error)
    }
};

module.exports = connectToDb;