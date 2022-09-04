const User = require("../../models/User");
const jwt = require("jsonwebtoken");

exports.signup = (req,res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin already exists",
      });

    const { firstName, lastName, email, password } = req.body;

    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      userName:Math.random().toString(),
      role:'admin'
    });

    User.create(_user,(error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
          error:error
        });
      }
      if (data) {
        return res.status(201).json({
          message:'Admin created successfully',
        });
      }
    });
  });
};

exports.signin = (req,res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).send(error);
    if (user) {
      if (user.authenticate(req.body.password) && user.role === 'admin') {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
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
      }
    }
  });
};

exports.requireSignin = (req,res,next)=>{
    const token = req.header("auth-token");
     const user = jwt.verify(token,process.env.JWT_SECRET)
     req.user=user
     next()
}