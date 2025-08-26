const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
//handle errors
const handleError = (err) => {
  console.log("err mesa", err);

  console.log(err.message, err.code);
  let errors = { email: "", password: "" };
  // let errors = { };

  //incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "Email is not registered";
  }
  if (err.message === "Incorrect password") {
    errors.password = "Password is incorrect";
  }

  //duplicate error code
  if (err.code === 11000) {
    errors["email"] = "Email is already registered";
    return errors;
  }
  //validation errors

  if (err.message.includes("user validation failed")) {
    console.log("errorrfghj", Object.values(err.errors));
    // Object.values(err.errors).forEach(error => {
    //     console.log(error.properties);

    // })
    Object.values(err.errors).forEach(({ properties }) => {
      //properties is object destructuring            console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
//jwt

const createToken = (id) => {
  return jwt.sign({ id }, "my secretkey", {
    expiresIn: maxAge,
  });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleError(error);
    // res.status(400).send("User not created");
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    console.log("errors", errors);

    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/home');
}
