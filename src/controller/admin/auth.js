const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const shortid = require('shortid')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 587, // Use the appropriate port for Elastic Email (587 is the common SMTP port)
  secure: false, // Set to true if you are using a secure connection (e.g., SSL or TLS)
  auth: {
    user: 'Naveen',
    pass: 'Naveen@157',
  },
});

exports.signup = async (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Generate a new OTP (4-digit number)
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Send OTP via email
    const mailOptions = {
      from: 'naveenbaghel5429@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Failed to send OTP",
          error: error,
        });
      } else {
        // Store the OTP in the user's document for later verification
        const hash_password = await bcrypt.hash(password, 10);

        const _user = new User({
          firstName,
          lastName,
          email,
          hash_password,
          userName: shortid.generate(),
          role: 'admin',
          otp, 
        });

        User.create(_user, (error, data) => {
          if (error) {
            return res.status(400).json({
              message: "Something went wrong",
              error: error,
            });
          }
          if (data) {
            return res.status(201).json({
              message: 'Admin created successfully',
            });
          }
        });
      }
    });
  });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp === otp) {
      // OTP matches, mark the user as verified
      user.verified = true;
      user.otp = ''; // Clear the OTP for one-time use
      await user.save();

      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.signin = (req,res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).send(error);
    if (user) {
      const isPassword = await user.authenticate(req.body.password)
      if (isPassword && user.role === "admin" && user.verified) {
        // Generate a new OTP for the next signup
        const newOtp = Math.floor(1000 + Math.random() * 9000);
        user.otp = newOtp.toString();
        await user.save();

        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.cookie("token", token, { expiresIn: "24h" });
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password or User not verified",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    message: 'Signout successfully'
  })
}
