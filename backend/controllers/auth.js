import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    console.log(`[REGISTER] Attempting to register user: ${email}`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`[REGISTER] User already exists: ${email}`);
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, displayName });
    await newUser.save();
    console.log(`[REGISTER] User created and saved to MongoDB: ${email}`);

    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Frontend should redirect to login page after successful registration
    res.status(201).json({ accessToken, refreshToken, user: { id: newUser._id, email: newUser.email, displayName: newUser.displayName }, message: "Registration successful. Please login." });
  } catch (err) {
    console.error(`[REGISTER] Registration failed for ${req.body.email}:`, err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN] Attempting login for: ${email}`);
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log(`[LOGIN] Invalid credentials for: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    console.log(`[LOGIN] Login successful for: ${email}`);
    res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    console.error(`[LOGIN] Login failed for ${req.body.email}:`, err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    console.log(`[REFRESH] No refresh token provided.`);
    return res.status(401).json({ error: "Refresh token required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
    console.log(`[REFRESH] Access token refreshed for userId: ${decoded.userId}`);
    res.json({ accessToken });
  } catch (err) {
    console.error(`[REFRESH] Invalid refresh token:`, err);
    res.status(401).json({ error: "Invalid refresh token" });
  }
}; 