import { readJSON, writeJSON } from "../utils/fileUtils.js";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, "../data/user.json");
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const users = await readJSON(USERS_FILE);

    const userExists = users.find((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
  id: uuidv4(),
  name,
  email,
  password: hashedPassword
};

    users.push(newUser);

    await writeJSON(USERS_FILE, users); 

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error); 
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await readJSON(USERS_FILE);
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const token = await jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, message: "user login successful" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
