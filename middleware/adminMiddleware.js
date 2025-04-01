const jwt = require("jsonwebtoken");
const User = require("../models/user");  // Import your User model

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];  // Get token from header
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "No token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists and is admin
        const user = await User.findById(decoded.id);
        if (!user || user.role !== "admin") {
            return res.status(403).send({
                success: false,
                message: "Access denied. Only admin can add candidates."
            });
        }

        req.user = user;  // Store user data in request object
        next();

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = adminAuth;
