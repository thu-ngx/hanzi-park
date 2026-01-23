import brcypt from "bcrypt";
import User from "../models/User.js";

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    // check if missing input
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: "Username, password, email, firstname or lastname is missing",
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
      displayName: `${firstName} ${lastName}`,
    });

    // return
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error when calling signUp", error);
    return res.status(500).json({ message: "System error" });
  }
};
