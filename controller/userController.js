const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

const RegisterController=async(req,res)=>{

    try {
        const { name, age, address, aadharCardNumber, password, role } = req.body;

        // Validation
        if (!name || !age || !address || !aadharCardNumber || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ aadharCardNumber });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Aadhar Number alrady registered exists",
            });
        }

        // Check if an admin already exists
        const adminExists = await User.findOne({ role: "admin" });

        // Ensure only one admin exists
        let assignedRole = "voter";  // Default role
        if (!adminExists) {
            assignedRole = role === "admin" ? "admin" : "voter";  // First user can be admin
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            age,
            address,
            aadharCardNumber,
            password: hashedPassword,   // Store hashed password
            role: assignedRole          // Assign only one admin role
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            role: newUser.role
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Register API",
            error: error.message,
        });
    }

}

const LoginController=async(req,res)=>{
    try {
        const { aadharCardNumber, password } = req.body;
    
        // Validation
        if (!aadharCardNumber || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide Aadhar Card Number and password",
            });
        }
    
        // Check if user exists by Aadhar Card Number
        const user = await User.findOne({ aadharCardNumber });   // Use User here
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User not found",
            });
        }
    
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid Password",
            });
        }
    
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
    
        // Hide password in response
        user.password = undefined;
    
        res.status(200).send({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login API",
            error: error.message,
        });
    }
}

const updatePasswordController=async(req,res)=>{
    try {
        const user = await User.findById({ _id: req.body.id });  // Use User here
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found"
            });
        }
    
        // Get data from user
        const { OldPassword, newPassword } = req.body;
        if (!OldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Provide OldPassword and newPassword"
            });
        }
    
        // Check if old password is correct
        const isMatch = await bcrypt.compare(OldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid OldPassword",
            });
        }
    
        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
    
        // Update the password
        user.password = hashedPassword;
        await user.save();
    
        res.status(200).send({
            success: true,
            message: "Password Updated Successfully"
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Password API",
            error
        });
    }
    }

const getProfileController=async(req,res)=>{
    try {
        const user = await User.findById({_id:req.body.id})
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User Not Found"
            })
        }
        //handle password
        user.password=undefined
        //resp
        res.status(200).send({
            success:true,
            message:"User get Successfull",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in getuser API"
        })
    }
} 

const resetPasswordController = async (req, res) => {
    try {
        const { aadharCardNumber, newPassword } = req.body;

        // Validation
        if (!aadharCardNumber || !newPassword) {
            return res.status(400).send({
                success: false,
                message: "Please provide Aadhar Card Number and new password"
            });
        }

        // Find the user by Aadhar Card Number
        const user = await User.findOne({ aadharCardNumber });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found or invalid Aadhar Card Number"
            });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).send({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Reset Password API",
            error: error.message
        });
    }
};
    

module.exports = {RegisterController, LoginController, updatePasswordController, getProfileController, resetPasswordController}