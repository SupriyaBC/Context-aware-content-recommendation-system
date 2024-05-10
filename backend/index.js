const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes'); // Adjust the path based on your project structure
const Location = require('./models/user'); // Adjust the path based on your project structure

const app = express();


app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200'],
}));


app.use(cookieParser());
app.use(express.json());
app.use("/api",routes)

mongoose.connect("mongodb://localhost:27017/jwtproject", {
    useNewUrlParser: true,
    
})
    .then(() => {
        console.log("Connected to the database");
        app.listen(5000, () => {
            console.log("App is listening on port 5000");
        });
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

app.use("/api", routes);

app.post("/api/save-location", (req, res) => {
  console.log("Received request to save location");
  const { latitude, longitude } = req.body;

  // Create a new Location document
  const location = new Location({
      latitude,
      longitude,
  });

  // Save the location to the database
  location.save()
      .then(() => {
          console.log("Location saved successfully");
          res.status(200).json({ message: "Location saved successfully" });
      })
      .catch((error) => {
          console.error("Error saving location:", error);
          res.status(500).json({ error: "Internal Server Error" });
      });
});

