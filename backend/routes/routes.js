const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your User model

const router = Router();

// Middleware for token verification
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'secret key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const record = await User.findOne({ email });

        if (record) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        const result = await user.save();

        const { _id } = result.toJSON();
        const token = jwt.sign({ _id }, 'secret key');

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Success', user: result });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        const token = jwt.sign({ _id: user._id }, 'secret key');

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Success' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/facultylogin', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        const token = jwt.sign({ _id: user._id }, 'secret key');

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Success' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const { password, ...data } = user.toJSON();
        res.send(data);
    } catch (err) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.json({ message: 'Success' });
});

// Location-related route
router.post("/api/save-location", (req, res) => {
    console.log("Received request to save location");
    const { latitude, longitude } = req.body;

    
    
    // Update the user with the new location information
    User.findByIdAndUpdate(userId, { latitude, longitude }, { new: true })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            console.log("Location saved successfully");
            res.status(200).json({ message: "Location saved successfully" });
        })
        .catch((error) => {
            console.error("Error saving location:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

module.exports = router;
