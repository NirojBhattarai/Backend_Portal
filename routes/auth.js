const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "Neeerajisafullstackdeveloper";

//Create a User : POST Method "/api/auth/createuser" No login required
router.post(
  "/createuser",
  body("name", "Enter a valid name").isLength({min:3}),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 8 character long").isLength({min:5}),
  async (req, res) => {
    let success = false;
    //If there are errors, return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty() ) {
      return res.send({ success, errors: result.array() });
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    //check whether user email already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "This email already exist" });
      }
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken: authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Login a User : POST Method "/api/auth/login" No login required
router.post(
  "/login",
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 8 character long").exists(),
  async (req, res) => {
    let success = false;
    //If there are errors, return bad request and the errors
    const result = validationResult(req);
    if (result.isEmpty() === false) {
      return res.send({ errors: result.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please enter valid credentials" });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);

      if (!passwordcompare) {
        return res
          .status(400)
          .json({ success, error: "Please enter valid credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken: authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Get user data : POST Method "/api/auth/getuser" Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
