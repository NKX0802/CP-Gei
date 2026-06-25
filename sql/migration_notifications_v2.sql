-- Migration: Rework the notifications table for the full notification feature
-- (title / message / notification_type / is_read / created_by columns)
-- This is documentation only — run it yourself against TiDB Cloud, nothing here
-- is executed automatically by the app.
--
-- If your "notifications" table still has the old shape
-- (notification_id, user_id, notification_message, notification_created_at),
-- migrate it like this:

ALTER TABLE notifications
  ADD COLUMN title VARCHAR(150) NOT NULL DEFAULT 'Notification',
  ADD COLUMN message TEXT NULL,
  ADD COLUMN notification_type VARCHAR(20) NOT NULL DEFAULT 'general',
  ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN created_by INT NULL,
  ADD COLUMN created_at DATETIME NULL;

-- Backfill the new columns from the old ones
UPDATE notifications
SET message = notification_message,
    created_at = notification_created_at
WHERE message IS NULL;

-- Broadcast rows (old schema allowed user_id IS NULL = "all users") need to be
-- expanded into one row per user, since the new schema requires user_id NOT NULL.
-- Do this manually per broadcast row if you have any, e.g.:
--   INSERT INTO notifications (user_id, title, message, notification_type, is_read, created_by, created_at)
--   SELECT user_id, '<old title>', '<old message>', 'announcement', 0, NULL, '<old created_at>'
--   FROM users WHERE user_role = 'user';
-- ...then delete the original broadcast row.

-- Once every row has user_id, message and created_at populated, finish the migration:
ALTER TABLE notifications
  MODIFY COLUMN message TEXT NOT NULL,
  MODIFY COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFY COLUMN user_id INT NOT NULL,
  DROP COLUMN notification_message,
  DROP COLUMN notification_created_at,
  ADD CONSTRAINT fk_notifications_creator FOREIGN KEY (created_by) REFERENCES users(user_id);

-- If you're setting this up fresh (no existing data worth keeping), it's simplest to just:
--   DROP TABLE notifications;
-- then re-run the CREATE TABLE statement for "notifications" in sql/schema.sql.
