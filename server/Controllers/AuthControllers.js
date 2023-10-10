const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const maxAge = 2 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "saurav", { expiresIn: maxAge });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ email, password: hashedPassword });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true, // making it accessible to client-side JavaScript
      httpOnly: false, // cannot modify by the use in the clint side
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};


module.exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({email } );
  
      if (!user) {
        throw Error("incorrect email");
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw Error("incorrect password");
      }
  
      const token = createToken(user._id);
  
      res.cookie("jwt", token, {
        withCredentials: true, // making it accessible to client-side JavaScript
        httpOnly: false, // cannot modify by the user on the client side
        maxAge: maxAge * 1000,
      });
  
      res.status(200).json({ user: user._id, created: true });
    } catch (err) {
      console.error(err);
      const errors = handleErrors(err);
      res.json({ errors, created: false });
    }
  };
  