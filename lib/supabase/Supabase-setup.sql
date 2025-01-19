-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";
create extension if not exists "pgcrypto";

-- Create custom types
create type user_role as enum ('company', 'recruiter', 'freelancer');
create type shift_status as enum (
    'posted',
    'pending_approval',
    'assigned',
    'in_progress',
    'completed',
    'disputed',
    'cancelled'
);
create type payment_status as enum (
    'pending',
    'escrowed',
    'released',
    'disputed',
    'refunded'
);
create type verification_status as enum (
    'pending',
    'verified',
    'rejected'
);
create type dispute_status as enum (
    'open',
    'under_review',
    'resolved',
    'escalated'
);

-- Create users table (extends Supabase auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    role user_role not null,
    full_name text,
    email text unique,
    phone text,
    location geography(point),
    avatar_url text,
    preferred_language text default 'en',
    two_factor_enabled boolean default false,
    last_login_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create companies table (formerly clients)
create table public.companies (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references public.profiles on delete cascade,
    company_name text not null,
    business_type text,
    location geography(point),
    service_fee_percentage numeric default 8, -- Updated to 8% per requirements
    payment_methods jsonb,
    verification_status verification_status default 'pending',
    verification_documents jsonb,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create recruiters table (formerly agencies)
create table public.recruiters (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references public.profiles on delete cascade,
    company_name text not null,
    description text,
    service_fee_percentage numeric default 6, -- Updated to 6% per requirements
    verification_status verification_status default 'pending',
    verification_documents jsonb,
    staff_count int default 0,
    total_shifts_filled int default 0,
    success_rate numeric default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create freelancers table
create table public.freelancers (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references public.profiles on delete cascade,
    recruiter_id uuid references public.recruiters on delete set null,
    skills text[],
    certifications jsonb,
    experience_years numeric,
    hourly_rate_range jsonb, -- {min, max}
    preferred_locations geography(point)[],
    service_fee_percentage numeric default 10, -- Updated to 10% per requirements
    background_check_status verification_status default 'pending',
    background_check_date timestamptz,
    verification_documents jsonb,
    portfolio_url text,
    video_intro_url text,
    average_rating numeric default 0,
    total_shifts_completed int default 0,
    reliability_score numeric default 0,
    is_available boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create shifts table
create table public.shifts (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references public.companies not null,
    recruiter_id uuid references public.recruiters,
    title text not null,
    description text,
    location geography(point) not null,
    start_time timestamptz not null,
    end_time timestamptz not null,
    hourly_rate numeric not null,
    total_pay numeric not null,
    required_skills text[],
    required_certifications text[],
    special_instructions text,
    dress_code text,
    status shift_status default 'posted',
    is_recurring boolean default false,
    recurring_pattern jsonb,
    template_id uuid references public.shifts,
    orientation_required boolean default false,
    orientation_details jsonb,
    documents_url text[],
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint valid_shift_duration check (
        extract(epoch from (end_time - start_time))/3600 between 4 and 11.5
    )
);

-- Create shift applications table
create table public.shift_applications (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts on delete cascade,
    freelancer_id uuid references public.freelancers on delete cascade,
    status text default 'pending',
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create shift_assignments table
create table public.shift_assignments (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts on delete cascade,
    freelancer_id uuid references public.freelancers on delete cascade,
    clock_in_time timestamptz,
    clock_out_time timestamptz,
    clock_in_location geography(point),
    clock_out_location geography(point),
    clock_in_photo_url text,
    clock_out_photo_url text,
    work_report text,
    rating numeric check (rating between 1 and 5),
    feedback text,
    incident_report text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create payments table
create table public.payments (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts on delete cascade,
    base_amount numeric not null,
    company_fee_amount numeric not null,
    freelancer_fee_amount numeric not null,
    recruiter_fee_amount numeric,
    total_amount numeric not null,
    status payment_status default 'pending',
    escrow_funded_at timestamptz,
    payment_released_at timestamptz,
    transaction_reference text,
    payment_method jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create disputes table
create table public.disputes (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts on delete cascade,
    raised_by_id uuid references public.profiles,
    assigned_to_id uuid references public.profiles,
    status dispute_status default 'open',
    type text not null,
    description text not null,
    evidence_urls text[],
    resolution text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create messages table
create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts,
    sender_id uuid references public.profiles,
    recipient_id uuid references public.profiles,
    content text not null,
    is_read boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create availability table
create table public.availability (
    id uuid default uuid_generate_v4() primary key,
    freelancer_id uuid references public.freelancers on delete cascade,
    start_time timestamptz not null,
    end_time timestamptz not null,
    recurring boolean default false,
    recurring_pattern jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create activity_logs table
create table public.activity_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles,
    action text not null,
    entity_type text not null,
    entity_id uuid not null,
    details jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz default now()
);

-- Create notifications table
create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles,
    title text not null,
    content text not null,
    type text not null,
    is_read boolean default false,
    action_url text,
    created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.recruiters enable row level security;
alter table public.freelancers enable row level security;
alter table public.shifts enable row level security;
alter table public.shift_applications enable row level security;
alter table public.shift_assignments enable row level security;
alter table public.payments enable row level security;
alter table public.disputes enable row level security;
alter table public.messages enable row level security;
alter table public.availability enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notifications enable row level security;

-- Create necessary indexes
create index idx_shifts_status on public.shifts(status);
create index idx_shifts_start_time on public.shifts(start_time);
create index idx_freelancers_skills on public.freelancers using gin(skills);
create index idx_messages_recipient on public.messages(recipient_id, is_read);
create index idx_activity_logs_user on public.activity_logs(user_id, created_at);
create index idx_notifications_user on public.notifications(user_id, is_read);

-- Create functions for common operations
create or replace function public.calculate_shift_fees(
    base_amount numeric,
    company_id uuid,
    freelancer_id uuid,
    recruiter_id uuid
)
returns table (
    company_fee numeric,
    freelancer_fee numeric,
    recruiter_fee numeric,
    total_amount numeric
) as $$
declare
    company_fee_pct numeric;
    freelancer_fee_pct numeric;
    recruiter_fee_pct numeric;
begin
    -- Get fee percentages
    select service_fee_percentage into company_fee_pct
    from public.companies where id = company_id;
    
    select service_fee_percentage into freelancer_fee_pct
    from public.freelancers where id = freelancer_id;
    
    if recruiter_id is not null then
        select service_fee_percentage into recruiter_fee_pct
        from public.recruiters where id = recruiter_id;
    end if;
    
    -- Calculate fees
    company_fee := base_amount * (company_fee_pct / 100);
    freelancer_fee := base_amount * (freelancer_fee_pct / 100);
    recruiter_fee := case 
        when recruiter_id is not null then base_amount * (recruiter_fee_pct / 100)
        else 0
    end;
    
    total_amount := base_amount + company_fee;
    
    return next;
end;
$$ language plpgsql security definer;

-- Add necessary triggers
-- [Previous triggers remain the same]