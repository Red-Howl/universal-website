-- =====================================================
-- KALAMKAR NOTIFICATION SYSTEM DATABASE UPDATES
-- =====================================================
-- This script updates the notifications table to support
-- the new professional notification management system
-- =====================================================

-- 1. First, let's check if the notifications table exists and its current structure
-- (This is for reference - you can run this to see current structure)
/*
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
*/

-- 2. Add new columns to support the enhanced notification system
-- Add title column for better notification organization
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Add type column for notification categorization
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'announcement';

-- Add priority column for notification importance
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';

-- Add is_active column to control notification visibility
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add expires_at column for time-limited notifications
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 3. Update existing notifications to have proper titles
-- If title is null, use the first 50 characters of the message as title
UPDATE notifications 
SET title = CASE 
    WHEN title IS NULL OR title = '' THEN 
        CASE 
            WHEN LENGTH(message) > 50 THEN LEFT(message, 47) || '...'
            ELSE message
        END
    ELSE title
END
WHERE title IS NULL OR title = '';

-- 4. Set default type for existing notifications
UPDATE notifications 
SET type = 'announcement' 
WHERE type IS NULL;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_active ON notifications(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON notifications(expires_at);

-- 6. Add constraints for data integrity
-- Ensure type is one of the allowed values
ALTER TABLE notifications 
ADD CONSTRAINT IF NOT EXISTS check_notification_type 
CHECK (type IN ('announcement', 'update', 'maintenance', 'promotion'));

-- Ensure priority is one of the allowed values
ALTER TABLE notifications 
ADD CONSTRAINT IF NOT EXISTS check_notification_priority 
CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- 7. Create a view for active notifications (useful for frontend queries)
CREATE OR REPLACE VIEW active_notifications AS
SELECT 
    id,
    title,
    message,
    type,
    priority,
    created_at,
    expires_at
FROM notifications 
WHERE is_active = true 
AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC;

-- 8. Create a function to automatically deactivate expired notifications
CREATE OR REPLACE FUNCTION deactivate_expired_notifications()
RETURNS void AS $$
BEGIN
    UPDATE notifications 
    SET is_active = false 
    WHERE expires_at IS NOT NULL 
    AND expires_at <= NOW() 
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- 9. Create a trigger to automatically deactivate expired notifications
-- (Optional - you can run this manually or set up a cron job)
-- CREATE OR REPLACE FUNCTION trigger_deactivate_expired()
-- RETURNS trigger AS $$
-- BEGIN
--     PERFORM deactivate_expired_notifications();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER check_expired_notifications
--     AFTER INSERT OR UPDATE ON notifications
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_deactivate_expired();

-- 10. Insert some sample notifications for testing (optional)
-- Uncomment the lines below if you want to add sample data

/*
INSERT INTO notifications (title, message, type, priority, created_at) VALUES
('Welcome to Kalamkar', 'Thank you for joining our community! Explore our latest collection.', 'announcement', 'normal', NOW()),
('New Collection Launch', 'Discover our exclusive new designs. Limited time offer available!', 'promotion', 'high', NOW()),
('System Maintenance', 'We will be performing maintenance on Sunday from 2-4 AM. Apologies for any inconvenience.', 'maintenance', 'normal', NOW()),
('Order Status Update', 'Your order processing system has been improved for better tracking.', 'update', 'low', NOW());
*/

-- 11. Clean up any orphaned data (if any)
-- Remove any notifications with empty messages
DELETE FROM notifications WHERE message IS NULL OR TRIM(message) = '';

-- 12. Add comments to the table for documentation
COMMENT ON TABLE notifications IS 'Stores system notifications for user communication';
COMMENT ON COLUMN notifications.title IS 'Notification title for better organization';
COMMENT ON COLUMN notifications.type IS 'Type of notification: announcement, update, maintenance, promotion';
COMMENT ON COLUMN notifications.priority IS 'Priority level: low, normal, high, urgent';
COMMENT ON COLUMN notifications.is_active IS 'Whether the notification is currently active';
COMMENT ON COLUMN notifications.expires_at IS 'When the notification expires (NULL = never expires)';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check the updated table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Check active notifications
SELECT * FROM active_notifications LIMIT 5;

-- Check notification types distribution
SELECT 
    type, 
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM notifications), 2) as percentage
FROM notifications 
GROUP BY type 
ORDER BY count DESC;

-- =====================================================
-- ROLLBACK SCRIPT (if needed)
-- =====================================================
/*
-- To rollback these changes, run the following:

-- Remove the new columns
ALTER TABLE notifications DROP COLUMN IF EXISTS title;
ALTER TABLE notifications DROP COLUMN IF EXISTS type;
ALTER TABLE notifications DROP COLUMN IF EXISTS priority;
ALTER TABLE notifications DROP COLUMN IF EXISTS is_active;
ALTER TABLE notifications DROP COLUMN IF EXISTS expires_at;

-- Remove indexes
DROP INDEX IF EXISTS idx_notifications_created_at;
DROP INDEX IF EXISTS idx_notifications_type;
DROP INDEX IF EXISTS idx_notifications_is_active;
DROP INDEX IF EXISTS idx_notifications_expires_at;

-- Remove constraints
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS check_notification_type;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS check_notification_priority;

-- Remove view and functions
DROP VIEW IF EXISTS active_notifications;
DROP FUNCTION IF EXISTS deactivate_expired_notifications();
*/

-- =====================================================
-- END OF SCRIPT
-- =====================================================

