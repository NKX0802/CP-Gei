# Database Tables — Design Notes

This folder is the home for all shared SQL schema files.
When you are ready to write the actual SQL, create a file here (e.g. schema.sql).

## Tables we will need

### users
Stores both students and admins.
Fields: id, name, student_id, email, password_hash, role (student | admin), created_at

### rooms
Stores all bookable campus rooms.
Fields: id, name, capacity, location, type (study_room | lab | hall | etc.), facilities, description, status (active | inactive), created_at

### bookings
Stores every booking made by a student.
Fields: id, user_id (FK → users), room_id (FK → rooms), date, start_time, end_time, purpose, status (confirmed | cancelled | checked-in | completed | no-show), qr_code, created_at

### favourites
Links students to their favourite rooms.
Fields: id, user_id (FK → users), room_id (FK → rooms), created_at
Unique constraint on (user_id, room_id) — no duplicates.

### notifications
Stores messages sent to students (by admin or by system).
Fields: id, user_id (FK → users), subject, message, is_read (boolean), sent_at

## Notes
- All tables should use id as AUTO_INCREMENT primary key
- Use DATETIME or TIMESTAMP for date/time fields
- Foreign keys should CASCADE on delete where appropriate
- TiDB is MySQL-compatible — standard MySQL CREATE TABLE syntax works
