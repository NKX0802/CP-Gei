export default async function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
  );
  return res
    .status(200)
    .json({ success: true, data: { message: "Logged out." } });
}
