const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "Not authorized. No token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT VERIFY ERROR:", err.message);
      return res.status(403).json({ msg: "Wrong or expired token" });
    }

    req.user = decoded; // { id, iat, exp }
    next();
  });
};

module.exports = verifyToken;
