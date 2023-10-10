const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

exports.checkUser = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      // If there's no token, the user is not authenticated.
      return res.status(401).json({ status: false });
    }

    // Verify the token with the secret (consider using an environment variable for the secret).
    const decodedToken = jwt.verify(token, "saurav");

    // Check if the user associated with the token exists.
    const user = await User.findById(decodedToken.id);

    if (user) {
      // If the user exists, they are authenticated.
      return res.status(200).json({ status: true, user: user.email });
    } else {
      // If the user doesn't exist, the token is invalid.
      return res.status(401).json({ status: false });
    }
  } catch (err) {
    // Handle any errors that occur during token verification or database queries.
    console.error(err);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};
