-- Migration 001: Initial Schema
-- Created: February 2026
-- Description: Create all base tables for K9 GSD Kennel system

BEGIN;

-- ============================================
-- TABLE: admins
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================
-- TABLE: dogs
-- ============================================
CREATE TABLE IF NOT EXISTS dogs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    role VARCHAR(20) NOT NULL CHECK (role IN ('Stud', 'Dam', 'Both')),
    date_of_birth DATE,
    registration_number VARCHAR(50),
    pedigree_info TEXT,
    description TEXT,
    health_clearances TEXT,
    achievements TEXT,
    primary_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: puppies
-- ============================================
CREATE TABLE IF NOT EXISTS puppies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    date_of_birth DATE NOT NULL,
    color VARCHAR(50),
    weight_kg DECIMAL(5,2),
    microchip_number VARCHAR(50) UNIQUE,
    sire_id INTEGER REFERENCES dogs(id) ON DELETE SET NULL,
    dam_id INTEGER REFERENCES dogs(id) ON DELETE SET NULL,
    price_inr DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Sold')),
    description TEXT,
    personality_traits TEXT,
    health_notes TEXT,
    primary_image VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sold_at TIMESTAMP
);

-- ============================================
-- TABLE: puppy_images
-- ============================================
CREATE TABLE IF NOT EXISTS puppy_images (
    id SERIAL PRIMARY KEY,
    puppy_id INTEGER NOT NULL REFERENCES puppies(id) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: dog_images
-- ============================================
CREATE TABLE IF NOT EXISTS dog_images (
    id SERIAL PRIMARY KEY,
    dog_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: gallery
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('Image', 'Video')),
    file_path VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: bookings
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    puppy_id INTEGER REFERENCES puppies(id) ON DELETE SET NULL,
    puppy_gender_preference VARCHAR(10) CHECK (puppy_gender_preference IN ('Male', 'Female', 'No Preference')),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT booking_email_format CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================
-- INDEXES
-- ============================================

-- Puppies indexes
CREATE INDEX IF NOT EXISTS idx_puppies_status ON puppies(status);
CREATE INDEX IF NOT EXISTS idx_puppies_featured ON puppies(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_puppies_dob ON puppies(date_of_birth DESC);

-- Dogs indexes
CREATE INDEX IF NOT EXISTS idx_dogs_role ON dogs(role);
CREATE INDEX IF NOT EXISTS idx_dogs_active ON dogs(is_active) WHERE is_active = TRUE;

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active) WHERE is_active = TRUE;

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_dogs_updated_at ON dogs;
CREATE TRIGGER update_dogs_updated_at BEFORE UPDATE ON dogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_puppies_updated_at ON puppies;
CREATE TRIGGER update_puppies_updated_at BEFORE UPDATE ON puppies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- ============================================
-- Verification Queries (Run these after migration)
-- ============================================

-- Check all tables created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check indexes
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';