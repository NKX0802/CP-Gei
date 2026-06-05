// API: GET /api/favourites — return all rooms saved by the logged-in student
// API: POST /api/favourites — add a room to favourites (body: { roomId })
// API: DELETE /api/favourites — remove a room from favourites (query: ?roomId=...)
// Reads/writes to "favourites" table, links user_id and room_id
// Return 401 if not authenticated

export default async function handler(req, res) {}
