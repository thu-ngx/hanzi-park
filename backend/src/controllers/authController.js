import brcypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // usually below 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in ms

export const signUp = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // check if missing input
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "Username, password or email is missing",
      });
    }

    // check if user exists
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // hash password
    const hashedPassword = await brcypt.hash(password, 10);

    // create new user
    await User.create({
      username,
      hashedPassword,
      email,
    });

    // return
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error when calling signUp", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const logIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if data is missing
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username or password is missing" });
    }

    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Username or password is not correct" });
    }

    // compare hashedPassword with password input
    const passwordCorrect = await brcypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Username or password is not correct" });
    }

    // create access token with JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // create refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    // save refresh token in db
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // return refresh token via cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // separate FE and BE
      maxAge: REFRESH_TOKEN_TTL,
    });

    // return access token in respond
    return res
      .status(200)
      .json({ message: `User ${user.username} has logged in`, accessToken });
  } catch (error) {
    console.error("Error when calling logIn", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const logOut = async (req, res) => {
  try {
    // get refresh token from cookies
    const token = req.cookies?.refreshToken;
    if (token) {
      // delete refresh token in db
      await Session.deleteOne({ refreshToken: token });

      // delete refresh token in cookies
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error when calling logOut", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // get refresh token from cookies
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // compare with refresh token in db, check if expired
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token is expired" });
    }

    // create new access token
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Error when calling refreshToken", error);
    return res.status(500).json({ message: "System error" });
  }
};
