export default async function handler(req, res) {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;${secure}`,
  );
  return res
    .status(200)
    .json({ success: true, data: { message: "Logged out." } });
}
