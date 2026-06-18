import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Name, email and password are required.",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 8 characters.",
    });
  }
  try {
    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE user_email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_role, user_created_at) VALUES (?, ?, ?, 'user', NOW())",
      [name, email, hashedPassword],
    );

    return res.status(201).json({
      success: true,
      data: { message: "Account created successfully." },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
}
