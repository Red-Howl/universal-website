-- Add scheduling functionality to notifications table
-- Run this in your Supabase SQL editor

-- Add scheduling columns to notifications table
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_scheduled BOOLEAN DEFAULT FALSE;

-- Add index for better performance on scheduled queries
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_scheduled ON notifications(is_scheduled);

-- Add comments for documentation
COMMENT ON COLUMN notifications.scheduled_at IS 'When the notification is scheduled to be sent';
COMMENT ON COLUMN notifications.is_scheduled IS 'Whether this notification is scheduled for future delivery';

-- Update existing notifications to have is_scheduled = false
UPDATE notifications 
SET is_scheduled = FALSE 
WHERE is_scheduled IS NULL;

-- Make is_scheduled NOT NULL with default
ALTER TABLE notifications 
ALTER COLUMN is_scheduled SET NOT NULL,
ALTER COLUMN is_scheduled SET DEFAULT FALSE;

-- Grant permissions (adjust as needed for your setup)
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
GRANT USAGE ON SEQUENCE notifications_id_seq TO authenticated;
