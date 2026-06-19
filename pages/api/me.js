import { jwtVerify } from "jose";

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, error: "Not logged in." });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );

    return res.status(200).json({
      success: true,
      data: {
        user_id: payload.user_id,
        user_role: payload.user_role,
        user_name: payload.user_name,
        user_email: payload.user_email,
      },
    });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired session." });
  }
}
