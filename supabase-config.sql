-- EXTRASTAFF360 Enterprise Database Schema
-- Version: 2.0.0
-- Platform: Supabase/PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Role-Based Access Control
CREATE TYPE user_role AS ENUM ('client', 'staff', 'agency', 'admin');
CREATE TYPE shift_status AS ENUM ('draft', 'published', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Core Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    email TEXT UNIQUE NOT NULL,
    encrypted_password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT email_validation CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Client Profiles
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    tax_id TEXT,
    address JSONB NOT NULL,
    billing_info JSONB,
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_client_profile UNIQUE (user_id)
);

-- Staff Profiles
CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] NOT NULL,
    certifications JSONB DEFAULT '[]'::jsonb,
    experience_years INTEGER,
    availability JSONB,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0.0,
    background_check_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_staff_profile UNIQUE (user_id),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Agency Profiles
CREATE TABLE agency_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agency_name TEXT NOT NULL,
    license_number TEXT UNIQUE,
    service_areas JSONB,
    staff_capacity INTEGER,
    commission_rate DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_agency_profile UNIQUE (user_id)
);

-- Shifts
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client_profiles(id),
    status shift_status DEFAULT 'draft',
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB NOT NULL,
    location GEOGRAPHY(POINT),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_timeframe CHECK (end_time > start_time),
    CONSTRAINT valid_hourly_rate CHECK (hourly_rate > 0)
);

-- Shift Applications
CREATE TABLE shift_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID REFERENCES shifts(id),
    staff_id UUID REFERENCES staff_profiles(id),
    agency_id UUID REFERENCES agency_profiles(id),
    status TEXT DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_application UNIQUE (shift_id, staff_id)
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID REFERENCES shifts(id),
    payer_id UUID REFERENCES users(id),
    payee_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    payment_method JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_platform_fee CHECK (platform_fee >= 0)
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID REFERENCES shifts(id),
    reviewer_id UUID REFERENCES users(id),
    reviewee_id UUID REFERENCES users(id),
    rating DECIMAL(3,2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT unique_review UNIQUE (shift_id, reviewer_id, reviewee_id)
);

-- Realtime Enable
ALTER PUBLICATION supabase_realtime ADD TABLE shifts;
ALTER PUBLICATION supabase_realtime ADD TABLE shift_applications;

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Shift Policies
CREATE POLICY "Anyone can view published shifts" ON shifts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Clients can manage their shifts" ON shifts
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM client_profiles WHERE id = client_id
    ));

-- Application Policies
CREATE POLICY "Staff can view their applications" ON shift_applications
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM staff_profiles WHERE id = staff_id
    ));

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Indexes for Performance
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_shifts_location ON shifts USING GIST(location);
CREATE INDEX idx_staff_skills ON staff_profiles USING GIN(skills);
CREATE INDEX idx_payments_status ON payments(status);
