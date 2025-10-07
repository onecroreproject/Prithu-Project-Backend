const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Quick check for missing/invalid header
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Verify JWT (synchronously — very fast for short payloads)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

    // 3️⃣ Attach decoded info directly
    req.Id = decoded.userId;
    req.role = decoded.role;
    req.accountId = decoded.accountId;
    req.userName = decoded.userName;

    return next();
  } catch (err) {
    // 4️⃣ Handle specific JWT errors efficiently
    const message =
      err.name === "TokenExpiredError"
        ? "Your session expired, please login again."
        : err.name === "JsonWebTokenError"
        ? "Invalid token, please login again."
        : "Token verification failed.";

    return res.status(401).json({ message });
  }
};
