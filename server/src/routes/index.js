const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');  // Import body-parser

const Collection1 = require("../../mongodb");
const collection1 = require("../../mongodb");

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Assuming your script.js is in a "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes using the router
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/api/login", async (req, res) => {
    const { name, password, userType } = req.body;

    if (!name || !password || !userType) {
        return res.send("Invalid signup data");
    }

    const data = {
        name,
        password,
        userType
    };

    await Collection1.insertMany([data]);

    // Redirect based on userType
    if (userType === 'student') {
        return res.render("home");
    } else if (userType === 'faculty') {
        return res.render("homef");
    } else {
        return res.send("Invalid userType");
    }

    try {
        const check = await collection1.findOne({ name: req.body.name });

        if (check.password === req.body.password) {
            res.render("home");
        } else {
            res.send("wrong password");
        }

    } catch {
        res.send("wrong details");
    }
});

router.post("/api/signup", async (req, res) => {
    const { name, password, userType } = req.body;

    if (!name || !password || !userType) {
        return res.send("Invalid signup data");
    }

    const data = {
        name,
        password,
        userType
    };

    await Collection1.insertMany([data]);

    // Redirect based on userType
    if (userType === 'student') {
        return res.render("home");
    } else if (userType === 'faculty') {
        return res.render("homef");
    } else {
        return res.send("Invalid userType");
    }
});

// Use the router for all routes starting with /api
app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
