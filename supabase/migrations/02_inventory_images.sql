-- Add product imagery to inventory (safe for existing Hermes DBs)

ALTER TABLE inventory
    ADD COLUMN IF NOT EXISTS image_url TEXT;

UPDATE inventory SET image_url = 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=200&h=200&q=80'
WHERE product_name = 'Celestial Silk Scarf — Midnight Constellation'
  AND (image_url IS NULL OR image_url = '');

UPDATE inventory SET image_url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&h=200&q=80'
WHERE product_name = 'Artisan Ceramic Pour-Over Set'
  AND (image_url IS NULL OR image_url = '');

UPDATE inventory SET image_url = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=200&h=200&q=80'
WHERE product_name = 'Hand-Poured Amber & Vetiver Candle'
  AND (image_url IS NULL OR image_url = '');

UPDATE inventory SET image_url = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&h=200&q=80'
WHERE product_name = 'Organic Linen Lounge Set — Sand'
  AND (image_url IS NULL OR image_url = '');

UPDATE inventory SET image_url = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&h=200&q=80'
WHERE product_name = 'Recycled Brass Statement Earrings'
  AND (image_url IS NULL OR image_url = '');
