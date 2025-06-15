
-- Add Jumma prayer time to mosque_settings
UPDATE mosque_settings 
SET prayer_times = prayer_times || '{"jumma": "13:00"}'::jsonb
WHERE id = '1';

-- Add Ramadan times to mosque_settings 
ALTER TABLE mosque_settings 
ADD COLUMN ramadan_times jsonb DEFAULT '{"sehri": "04:30", "iftar": "18:30"}'::jsonb;

-- Add salary history reference to expenses table
ALTER TABLE expenses 
ADD COLUMN imam_id text REFERENCES imam(id),
ADD COLUMN description text;

-- Update expense types to include imam salary and bonus
ALTER TABLE expenses 
ADD CONSTRAINT valid_expense_types 
CHECK (type IN ('Utility', 'Maintenance', 'Imam Salary', 'Imam Bonus', 'Event', 'Electricity Bill', 'Others'));
