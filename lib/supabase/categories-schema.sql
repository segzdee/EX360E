-- Create categories tables
create table public.company_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.agency_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.staff_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.position_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    description text,
    department text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Add category relationships to existing tables
alter table public.companies 
add column category_id uuid references public.company_categories(id);

alter table public.recruiters
add column category_id uuid references public.agency_categories(id);

alter table public.freelancers
add column staff_category_id uuid references public.staff_categories(id);

-- Create positions-shifts junction table
create table public.shift_positions (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts(id) on delete cascade,
    position_id uuid references public.position_categories(id),
    quantity int default 1,
    created_at timestamptz default now(),
    unique(shift_id, position_id)
);

-- Seeds for categories
-- Note: This would be in a separate migration file
insert into public.company_categories (name) values
('Full-Service Hotel'),
('Limited-Service Hotel'),
('Boutique Hotel'),
('Luxury Hotel'),
-- ... add all company categories

insert into public.agency_categories (name) values
('Staffing Agency'),
('Temping Agency'),
('Recruitment Agency'),
('Executive Search Firm'),
-- ... add all agency categories

insert into public.staff_categories (name) values
('Full-Time Staff'),
('Part-Time Staff'),
('Casual Staff'),
('Extra-Hands'),
-- ... add all staff categories

insert into public.position_categories (name, department) values
('Hotel General Manager', 'Management'),
('Assistant General Manager', 'Management'),
('Front Office Manager', 'Front Office'),
('Concierge', 'Front Office'),
-- ... add all position categories

-- Create indexes
create index idx_companies_category on public.companies(category_id);
create index idx_recruiters_category on public.recruiters(category_id);
create index idx_freelancers_staff_category on public.freelancers(staff_category_id);
create index idx_shift_positions_shift on public.shift_positions(shift_id);
create index idx_shift_positions_position on public.shift_positions(position_id);