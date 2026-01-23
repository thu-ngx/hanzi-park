import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    // get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "No access token found" });
    }

    // verify token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedUser) => {
        if (error) {
          console.error(error);
          return res.status(403).json({ message: "Expired or invalid token" });
        }

        // find user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );

        // return user in request
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Error when validating JWT in authMiddleware", error);
    return res.status(500).json({ message: "System error" });
  }
};
