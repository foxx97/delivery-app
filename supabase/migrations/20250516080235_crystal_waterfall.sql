/*
  # Create orders table with RLS

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (text)
      - `timestamp` (bigint)
      - `tip_type` (text, either 'cash' or 'prepaid')
      - `tip_amount` (float)

  2. Security
    - Enable RLS on `orders` table
    - Add policy for authenticated users to read/write their own orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date text NOT NULL,
  timestamp bigint NOT NULL,
  tip_type text CHECK (tip_type IN ('cash', 'prepaid')),
  tip_amount float,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own orders
CREATE POLICY "Users can insert own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own orders
CREATE POLICY "Users can update own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own orders
CREATE POLICY "Users can delete own orders"
  ON orders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_date_idx ON orders(date);