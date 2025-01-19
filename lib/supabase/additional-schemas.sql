-- Skills and Certifications Management
create type certification_status as enum (
    'pending',
    'verified',
    'expired',
    'rejected'
);

create table public.skill_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.skills (
    id uuid default uuid_generate_v4() primary key,
    category_id uuid references public.skill_categories,
    name text not null,
    description text,
    is_verified boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.certifications (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    issuing_authority text,
    description text,
    validity_period interval,
    required_renewal_proof boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.freelancer_skills (
    id uuid default uuid_generate_v4() primary key,
    freelancer_id uuid references public.freelancers on delete cascade,
    skill_id uuid references public.skills on delete cascade,
    years_experience numeric,
    proficiency_level int check (proficiency_level between 1 and 5),
    is_verified boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.freelancer_certifications (
    id uuid default uuid_generate_v4() primary key,
    freelancer_id uuid references public.freelancers on delete cascade,
    certification_id uuid references public.certifications on delete cascade,
    certificate_number text,
    issued_date date not null,
    expiry_date date,
    document_url text,
    status certification_status default 'pending',
    verification_notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Training and Development
create table public.training_modules (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    duration interval,
    skill_category_id uuid references public.skill_categories,
    content_url text,
    is_mandatory boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.freelancer_training (
    id uuid default uuid_generate_v4() primary key,
    freelancer_id uuid references public.freelancers on delete cascade,
    module_id uuid references public.training_modules on delete cascade,
    completion_date timestamptz,
    score numeric,
    certificate_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Performance and Ratings
create table public.performance_metrics (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    weight numeric default 1,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.shift_ratings (
    id uuid default uuid_generate_v4() primary key,
    shift_assignment_id uuid references public.shift_assignments on delete cascade,
    rated_by_id uuid references public.profiles,
    metrics jsonb not null, -- {metric_id: score}
    overall_rating numeric check (overall_rating between 1 and 5),
    comments text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.freelancer_badges (
    id uuid default uuid_generate_v4() primary key,
    freelancer_id uuid references public.freelancers on delete cascade,
    badge_type text not null,
    description text,
    awarded_at timestamptz default now(),
    created_at timestamptz default now()
);

-- Location and Availability Management
create table public.service_areas (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    city text,
    state text,
    country text,
    coordinates geography(point),
    radius numeric, -- in kilometers
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.freelancer_service_areas (
    id uuid default uuid_generate_v4() primary key,
    freelancer_id uuid references public.freelancers on delete cascade,
    service_area_id uuid references public.service_areas on delete cascade,
    is_primary boolean default false,
    travel_preferences jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Scheduling and Calendar
create table public.recurring_shifts (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references public.companies not null,
    title text not null,
    description text,
    location geography(point),
    recurring_pattern jsonb not null, -- {frequency, days, time, etc.}
    hourly_rate numeric,
    required_skills text[],
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.shift_templates (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references public.companies not null,
    title text not null,
    description text,
    duration interval,
    hourly_rate numeric,
    required_skills text[],
    special_instructions text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Communication and Notifications
create type notification_type as enum (
    'shift_offer',
    'shift_reminder',
    'payment',
    'rating',
    'document',
    'system'
);

create table public.notification_preferences (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles on delete cascade,
    notification_type notification_type,
    email boolean default true,
    sms boolean default false,
    push boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.communication_threads (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts,
    title text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    thread_id uuid references public.communication_threads on delete cascade,
    sender_id uuid references public.profiles,
    content text not null,
    attachments jsonb,
    read_by jsonb default '[]'::jsonb,
    created_at timestamptz default now()
);

-- Analytics and Reporting
create table public.shift_analytics (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts on delete cascade,
    metrics jsonb not null, -- {completion_rate, fill_time, etc.}
    created_at timestamptz default now()
);

create table public.company_analytics (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references public.companies on delete cascade,
    metrics jsonb not null, -- {shifts_posted, fill_rate, etc.}
    period_start date not null,
    period_end date not null,
    created_at timestamptz default now()
);

create table public.freelancer_analytics (
    id uuid default uuid_generate_v4() primary key,
    freelancer_id uuid references public.freelancers on delete cascade,
    metrics jsonb not null, -- {completion_rate, reliability_score, etc.}
    period_start date not null,
    period_end date not null,
    created_at timestamptz default now()
);

-- Create necessary indexes
create index idx_freelancer_skills_freelancer on public.freelancer_skills(freelancer_id);
create index idx_freelancer_certifications_freelancer on public.freelancer_certifications(freelancer_id);
create index idx_shift_ratings_assignment on public.shift_ratings(shift_assignment_id);
create index idx_freelancer_service_areas_freelancer on public.freelancer_service_areas(freelancer_id);
create index idx_messages_thread on public.messages(thread_id);

-- Enable Row Level Security
alter table public.freelancer_skills enable row level security;
alter table public.freelancer_certifications enable row level security;
alter table public.freelancer_training enable row level security;
alter table public.shift_ratings enable row level security;
alter table public.freelancer_service_areas enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.messages enable row level security;