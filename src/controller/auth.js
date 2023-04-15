const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");


const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};


exports.signup = (req,res) => {
  User.findOne({ email: req.body.email }).exec(async(error, user) => {
    if (user)
      return res.status(400).json({
        error: "User already exists",
      });

    const { firstName, lastName, email, password } = req.body;
    const hash_password =await bcrypt.hash(password,10)

    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      userName:shortid.generate()
    });

    User.create(_user,(error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
          error:error
        });
      }
      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};

exports.signin = (req,res) => {
  User.findOne({ email: req.body.email }).exec(async(error, user) => {
    if (error) return res.status(400).send({error});
    if (user) {
      if (user.authenticate(req.body.password) && user.role === "user") {
        const token = generateJwtToken(user._id, user.role);
        const { firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: {
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

