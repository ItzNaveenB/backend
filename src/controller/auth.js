const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const UserOTPVerification = require("../models/UserOTPVerification");
const UserRequest = require("../models/userRequest");
const { validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail"); 

sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hash_password = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000);

    const user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      userName: shortid.generate(),
    });

    await user.save();

    const otpData = new UserOTPVerification({
      userId: user._id,
      otp: otp.toString(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await otpData.save();

    // Send OTP via email using SendGrid
    const msg = {
      to: user.email,
      from: "naveenbaghel5429@gmail.com", // Replace with your email
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    await sgMail.send(msg);

    // Create a user request
    const userRequest = new UserRequest({
      userId: user._id,
      requestedBy: null, // Requested by the user themselves
      status: "pending",
    });

    await userRequest.save();

    const token = generateJwtToken(user._id, user.role);
    const { _id, fullName } = user;

    res.status(201).json({
      token,
      user: { _id, firstName, lastName, email, fullName },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.signin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const otpVerification = await UserOTPVerification.findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpVerification) {
      return res.status(400).json({
        error: "Invalid OTP or OTP expired",
      });
    }

    const isPasswordValid = await user.authenticate(password);

    if (!isPasswordValid || user.role !== "user") {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // Delete the OTP verification data after successful login
    await UserOTPVerification.deleteOne({ _id: otpVerification._id });

    const token = generateJwtToken(user._id, user.role);
    const { _id, fullName } = user;

    res.status(200).json({
      token,
      user: { _id, firstName: user.firstName, lastName: user.lastName, email, fullName },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
