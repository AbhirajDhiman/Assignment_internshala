const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    return res.json({
      message: "Login successful",
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const getMe = async (req, res) => {
  return res.json({ data: { user: req.user.toJSON() } });
};

const updateMe = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (name !== undefined) req.user.name = name;
    if (password !== undefined) {
      if (String(password).length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      req.user.password = password;
    }

    await req.user.save();

    return res.json({
      message: "Profile updated",
      data: { user: req.user.toJSON() }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe
};
