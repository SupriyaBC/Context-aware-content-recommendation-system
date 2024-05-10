const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process if unable to connect to MongoDB
    });

const LogInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

LogInSchema.index({ name: 1 }, { unique: true });

const Collection1 = mongoose.model("Collection1", LogInSchema);

module.exports = Collection1;
