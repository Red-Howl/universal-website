-- Add quantity and ordered_quantity columns to products table for inventory management
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ordered_quantity INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity);
CREATE INDEX IF NOT EXISTS idx_products_ordered_quantity ON products(ordered_quantity);

-- Add comments for documentation
COMMENT ON COLUMN products.quantity IS 'Total quantity of the product available';
COMMENT ON COLUMN products.ordered_quantity IS 'Quantity of the product that has been ordered';

-- Update existing products to have default quantities if they don't have one
UPDATE products SET quantity = 10 WHERE quantity IS NULL OR quantity = 0;
UPDATE products SET ordered_quantity = 0 WHERE ordered_quantity IS NULL;

-- Make columns NOT NULL with default values
ALTER TABLE products ALTER COLUMN quantity SET NOT NULL;
ALTER TABLE products ALTER COLUMN quantity SET DEFAULT 0;
ALTER TABLE products ALTER COLUMN ordered_quantity SET NOT NULL;
ALTER TABLE products ALTER COLUMN ordered_quantity SET DEFAULT 0;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT USAGE ON SEQUENCE products_id_seq TO authenticated;
