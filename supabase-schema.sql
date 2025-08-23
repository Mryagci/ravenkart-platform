-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER', 'VIEWER');
CREATE TYPE plan_type AS ENUM ('FREE', 'PRO', 'CORPORATE');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'TRIAL');

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    plan plan_type DEFAULT 'FREE',
    max_seats INTEGER DEFAULT 1,
    used_seats INTEGER DEFAULT 0,
    subscription_status subscription_status DEFAULT 'TRIAL',
    subscription_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    title VARCHAR(200),
    company VARCHAR(200),
    phone VARCHAR(20),
    website TEXT,
    bio TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'MEMBER',
    theme VARCHAR(10) DEFAULT 'dark',
    language VARCHAR(5) DEFAULT 'tr',
    ribbon_gradient JSONB DEFAULT '{"start": "#00D4AA", "end": "#8B5CF6"}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media links
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'linkedin', 'twitter', 'instagram', etc.
    username VARCHAR(100) NOT NULL,
    url TEXT GENERATED ALWAYS AS (
        CASE platform
            WHEN 'linkedin' THEN 'https://linkedin.com/in/' || username
            WHEN 'twitter' THEN 'https://twitter.com/' || username
            WHEN 'instagram' THEN 'https://instagram.com/' || username
            WHEN 'tiktok' THEN 'https://tiktok.com/@' || username
            WHEN 'youtube' THEN 'https://youtube.com/@' || username
            WHEN 'facebook' THEN 'https://facebook.com/' || username
            WHEN 'snapchat' THEN 'https://snapchat.com/add/' || username
            WHEN 'telegram' THEN 'https://t.me/' || username
            WHEN 'pinterest' THEN 'https://pinterest.com/' || username
            WHEN 'whatsapp' THEN 'https://wa.me/' || username
        END
    ) STORED,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects/Products
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    external_url TEXT,
    slug VARCHAR(100),
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project images (for internal project pages)
CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card analytics
CREATE TABLE card_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(5),
    device_type VARCHAR(20), -- 'mobile', 'desktop', 'tablet'
    referrer TEXT
);

-- Scanned cards (for Pro+ users)
CREATE TABLE scanned_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scanner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    notes TEXT,
    extracted_data JSONB,
    folder VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions and payments
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plan_type plan_type NOT NULL,
    status subscription_status DEFAULT 'ACTIVE',
    price_per_seat DECIMAL(10,2),
    seats INTEGER NOT NULL,
    current_period_start DATE NOT NULL,
    current_period_end DATE NOT NULL,
    payment_provider VARCHAR(50), -- 'paytr', 'stripe', etc.
    provider_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    subscription_id UUID REFERENCES subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    payment_provider VARCHAR(50),
    provider_payment_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_social_links_user_id ON social_links(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_card_views_user_id ON card_views(user_id);
CREATE INDEX idx_card_views_viewed_at ON card_views(viewed_at);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Row Level Security (RLS) Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE scanned_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (you'll need to expand these based on your needs)

-- Profiles: Users can read their own profile and public profiles, edit their own
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Social links: Public read, owner can manage
CREATE POLICY "Social links are viewable by everyone" 
ON social_links FOR SELECT 
USING (true);

CREATE POLICY "Users can manage own social links" 
ON social_links FOR ALL 
USING (auth.uid() = user_id);

-- Projects: Public read, owner can manage
CREATE POLICY "Public projects are viewable by everyone" 
ON projects FOR SELECT 
USING (is_visible = true);

CREATE POLICY "Users can manage own projects" 
ON projects FOR ALL 
USING (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to generate unique username
CREATE OR REPLACE FUNCTION generate_username()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.username IS NULL THEN
        NEW.username = LOWER(NEW.first_name || NEW.last_name || SUBSTRING(NEW.id::text FROM 1 FOR 4));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_username_trigger 
    BEFORE INSERT ON profiles 
    FOR EACH ROW EXECUTE FUNCTION generate_username();