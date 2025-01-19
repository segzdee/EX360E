-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create user types
create type user_role as enum ('agency', 'company', 'staff');
create type subscription_status as enum ('trial', 'active', 'suspended', 'cancelled');

-- Create authentication and user tables
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role user_role not null,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table agencies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  description text,
  logo_url text,
  website text,
  contact_email text not null,
  contact_phone text,
  address text,
  rating decimal(3,2) default 0,
  subscription_status subscription_status default 'trial',
  subscription_end_date timestamptz,
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  industry text,
  logo_url text,
  website text,
  primary_contact_name text not null,
  primary_contact_email text not null,
  primary_contact_phone text,
  billing_address text,
  payment_terms jsonb,
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create custom types
create type staff_status as enum ('Available', 'On Shift', 'Off Duty', 'On Break');
create type shift_status as enum ('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Starting Soon');
create type payment_status as enum ('Pending', 'Completed', 'Failed', 'Refunded');
create type activity_type as enum ('shift_completed', 'new_booking', 'staff_available', 'payment_received', 'shift_cancelled');
create type document_status as enum ('Pending', 'Verified', 'Expired', 'Rejected');

-- Create tables
create table staff (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  agency_id uuid references agencies(id) on delete restrict,
  name text not null,
  email text unique not null,
  phone text,
  profile_image_url text,
  date_of_birth date,
  emergency_contact jsonb,
  skills text[],
  certifications jsonb[],
  rating decimal(3,2) default 0,
  status staff_status default 'Available',
  shifts_completed integer default 0,
  hourly_rate decimal(10,2),
  preferred_locations geography(point)[],
  max_travel_distance integer, -- in kilometers
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table staff_availability (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references staff(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);

create table staff_documents (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references staff(id) on delete cascade,
  type text not null,
  status document_status default 'Pending',
  file_url text not null,
  expiry_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table staff_bank_details (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references staff(id) on delete cascade,
  account_name text not null,
  account_number text not null,
  routing_number text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table venues (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete restrict,
  name text not null,
  type text not null,
  address text not null,
  coordinates geography(point),
  contact_name text not null,
  contact_phone text,
  contact_email text,
  payment_terms jsonb,
  requirements jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table shifts (
  id uuid primary key default uuid_generate_v4(),
  venue_id uuid references venues(id) on delete restrict,
  start_time timestamptz not null,
  end_time timestamptz not null,
  staff_needed integer not null,
  staff_assigned integer default 0,
  hourly_rate decimal(10,2) not null,
  status shift_status default 'Scheduled',
  requirements text[],
  notes text,
  uniform_requirements text[],
  break_schedule jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table shift_assignments (
  id uuid primary key default uuid_generate_v4(),
  shift_id uuid references shifts(id) on delete cascade,
  staff_id uuid references staff(id) on delete restrict,
  status shift_status default 'Scheduled',
  check_in_time timestamptz,
  check_out_time timestamptz,
  break_start timestamptz,
  break_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(shift_id, staff_id)
);

create table payments (
  id uuid primary key default uuid_generate_v4(),
  shift_id uuid references shifts(id) on delete restrict,
  staff_id uuid references staff(id) on delete restrict,
  amount decimal(10,2) not null,
  status payment_status default 'Pending',
  payment_date timestamptz,
  payment_method text,
  reference text unique,
  fees jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payment Methods table
create table payment_methods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  stripe_payment_method_id text not null,
  type text not null,
  last4 text,
  brand text,
  exp_month integer,
  exp_year integer,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table activities (
  id uuid primary key default uuid_generate_v4(),
  type activity_type not null,
  message text not null,
  related_ids jsonb,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Create relationship tables
create table agency_company_relationships (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid references agencies(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  status text default 'pending',
  terms_agreed boolean default false,
  contract_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(agency_id, company_id)
);

create table staff_preferences (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references staff(id) on delete cascade,
  preferred_shift_duration integer[], -- in hours
  preferred_shift_times jsonb,
  blacklisted_venues uuid[],
  notification_preferences jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index idx_staff_status on staff(status);
create index idx_staff_rating on staff(rating);
create index idx_shifts_status on shifts(status);
create index idx_shifts_date on shifts(start_time);
create index idx_payments_status on payments(status);
create index idx_activities_type on activities(type);
create index idx_venues_location on venues using gist(coordinates);
create index idx_users_role on users(role);
create index idx_users_email on users(email);
create index idx_agencies_status on agencies(subscription_status);
create index idx_agencies_rating on agencies(rating);
create index idx_companies_verified on companies(verified);
create index idx_staff_agency on staff(agency_id);
create index idx_staff_locations on staff using gist(preferred_locations);

-- Additional indexes for performance
create index idx_shift_assignments_staff on shift_assignments(staff_id);
create index idx_shift_assignments_shift on shift_assignments(shift_id);
create index idx_shift_assignments_status on shift_assignments(status);
create index idx_shift_assignments_dates on shift_assignments(check_in_time, check_out_time);

create index idx_payments_dates on payments(payment_date);
create index idx_payments_staff_date on payments(staff_id, payment_date);
create index idx_payments_shift_date on payments(shift_id, payment_date);

create index idx_staff_documents_staff on staff_documents(staff_id);
create index idx_staff_documents_status on staff_documents(status);
create index idx_staff_documents_expiry on staff_documents(expiry_date);

create index idx_staff_bank_details_staff on staff_bank_details(staff_id);

create index idx_staff_preferences_staff on staff_preferences(staff_id);

create index idx_agency_company_status on agency_company_relationships(agency_id, company_id, status);

create index idx_activities_timestamp on activities(created_at);
create index idx_activities_related on activities using gin(related_ids);

create index idx_venues_company on venues(company_id);
create index idx_venues_type on venues(type);

create index idx_shifts_venue on shifts(venue_id);
create index idx_shifts_datetime_range on shifts(start_time, end_time);
create index idx_shifts_hourly_rate on shifts(hourly_rate);

create index idx_staff_skills on staff using gin(skills);
create index idx_staff_hourly_rate on staff(hourly_rate);
create index idx_staff_agency_status on staff(agency_id, status);

-- Create functions
create or replace function update_shift_staff_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update shifts
    set staff_assigned = staff_assigned + 1
    where id = NEW.shift_id;
  elsif TG_OP = 'DELETE' then
    update shifts
    set staff_assigned = staff_assigned - 1
    where id = OLD.shift_id;
  end if;
  return NEW;
end;
$$ language plpgsql;

create or replace function log_activity()
returns trigger as $$
begin
  insert into activities (type, message, related_ids)
  values (
    TG_ARGV[0]::activity_type,
    TG_ARGV[1],
    jsonb_build_object(
      'shift_id', NEW.id,
      'staff_id', NEW.staff_id,
      'venue_id', NEW.venue_id
    )
  );
  return NEW;
end;
$$ language plpgsql;

-- Create triggers
create trigger update_shift_staff_count
after insert or delete on shift_assignments
for each row execute function update_shift_staff_count();

create trigger log_shift_completion
after update of status on shifts
when (NEW.status = 'Completed')
for each row execute function log_activity('shift_completed', 'Shift completed');

create trigger log_new_booking
after insert on shifts
for each row execute function log_activity('new_booking', 'New shift booked');

-- Create RLS policies
alter table staff enable row level security;
alter table shifts enable row level security;
alter table payments enable row level security;
alter table activities enable row level security;
alter table users enable row level security;
alter table agencies enable row level security;
alter table companies enable row level security;
alter table venues enable row level security;
alter table staff_documents enable row level security;
alter table staff_bank_details enable row level security;
alter table staff_preferences enable row level security;
alter table agency_company_relationships enable row level security;

-- Staff policies
create policy "Staff can view their own profile"
on staff for select
using (auth.uid() = user_id);

create policy "Staff can update their own profile"
on staff for update
using (auth.uid() = user_id);

create policy "Agencies can view and manage their staff"
on staff for all
using (
  exists (
    select 1 from agencies
    where id = staff.agency_id
    and user_id = auth.uid()
  )
);

-- Agency policies
create policy "Agencies can manage their own profile"
on agencies for all
using (auth.uid() = user_id);

create policy "Companies can view agency profiles"
on agencies for select
using (
  exists (
    select 1 from agency_company_relationships
    where agency_id = agencies.id
    and company_id in (
      select id from companies where user_id = auth.uid()
    )
  )
);

-- Company policies
create policy "Companies can manage their own profile"
on companies for all
using (auth.uid() = user_id);

create policy "Agencies can view company profiles"
on companies for select
using (
  exists (
    select 1 from agency_company_relationships
    where company_id = companies.id
    and agency_id in (
      select id from agencies where user_id = auth.uid()
    )
  )
);

-- Venue policies
create policy "Companies can manage their venues"
on venues for all
using (
  exists (
    select 1 from companies
    where id = venues.company_id
    and user_id = auth.uid()
  )
);

create policy "Staff can view venue details"
on venues for select
using (
  exists (
    select 1 from shifts
    where venue_id = venues.id
    and id in (
      select shift_id from shift_assignments
      where staff_id in (
        select id from staff where user_id = auth.uid()
      )
    )
  )
);

-- Shift policies
create policy "Companies can manage shifts"
on shifts for all
using (
  exists (
    select 1 from venues
    where id = shifts.venue_id
    and company_id in (
      select id from companies where user_id = auth.uid()
    )
  )
);

create policy "Staff can view available shifts"
on shifts for select
using (
  status = 'Scheduled'
  or id in (
    select shift_id from shift_assignments
    where staff_id in (
      select id from staff where user_id = auth.uid()
    )
  )
);

-- Payment policies
create policy "Staff can view their payments"
on payments for select
using (
  staff_id in (
    select id from staff where user_id = auth.uid()
  )
);

create policy "Companies can view their payments"
on payments for select
using (
  exists (
    select 1 from shifts
    where id = payments.shift_id
    and venue_id in (
      select id from venues
      where company_id in (
        select id from companies where user_id = auth.uid()
      )
    )
  )
);

-- Document policies
create policy "Staff can manage their documents"
on staff_documents for all
using (
  staff_id in (
    select id from staff where user_id = auth.uid()
  )
);

create policy "Agencies can view staff documents"
on staff_documents for select
using (
  exists (
    select 1 from staff
    where id = staff_documents.staff_id
    and agency_id in (
      select id from agencies where user_id = auth.uid()
    )
  )
);

-- Bank details policies
create policy "Staff can manage their bank details"
on staff_bank_details for all
using (
  staff_id in (
    select id from staff where user_id = auth.uid()
  )
);

create policy "Agencies can view staff bank details"
on staff_bank_details for select
using (
  exists (
    select 1 from staff
    where id = staff_bank_details.staff_id
    and agency_id in (
      select id from agencies where user_id = auth.uid()
    )
  )
);

-- Staff preferences policies
create policy "Staff can manage their preferences"
on staff_preferences for all
using (
  staff_id in (
    select id from staff where user_id = auth.uid()
  )
);

-- Agency-Company relationship policies
create policy "Agencies and Companies can manage their relationships"
on agency_company_relationships for all
using (
  agency_id in (select id from agencies where user_id = auth.uid())
  or company_id in (select id from companies where user_id = auth.uid())
);

-- Activity policies
create policy "Users can view relevant activities"
on activities for select
using (
  exists (
    select 1 from jsonb_each_text(related_ids) as r
    where (
      r.key = 'staff_id' and r.value::uuid in (
        select id from staff where user_id = auth.uid()
      )
    ) or (
      r.key = 'agency_id' and r.value::uuid in (
        select id from agencies where user_id = auth.uid()
      )
    ) or (
      r.key = 'company_id' and r.value::uuid in (
        select id from companies where user_id = auth.uid()
      )
    )
  )
);

-- Create views for analytics
create view staff_performance as
select
  s.id,
  s.name,
  s.rating,
  count(sa.id) as total_shifts,
  sum(p.amount) as total_earnings
from staff s
left join shift_assignments sa on sa.staff_id = s.id
left join payments p on p.staff_id = s.id
group by s.id, s.name, s.rating;

-- Notification tables
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  data jsonb,
  read boolean default false,
  created_at timestamptz default now()
);

create table notification_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  email_preferences jsonb default '{"shift_notifications": true, "payment_notifications": true, "marketing_emails": false}',
  sms_preferences jsonb default '{"shift_reminders": true, "urgent_notifications": true}',
  push_preferences jsonb default '{"enabled": true, "quiet_hours": false}',
  updated_at timestamptz default now()
);

create table push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  token text not null unique,
  device_info jsonb,
  created_at timestamptz default now(),
  last_used_at timestamptz default now()
);

-- Indexes for notification tables
create index idx_notifications_user on notifications(user_id);
create index idx_notifications_type on notifications(type);
create index idx_notifications_read on notifications(read);
create index idx_notifications_created on notifications(created_at);

create index idx_notification_preferences_user on notification_preferences(user_id);

create index idx_push_tokens_user on push_tokens(user_id);
create index idx_push_tokens_token on push_tokens(token);

-- RLS policies for notification tables
alter table notifications enable row level security;
alter table notification_preferences enable row level security;
alter table push_tokens enable row level security;

create policy "Users can manage their notifications"
on notifications for all
using (user_id = auth.uid());

create policy "Users can manage their notification preferences"
on notification_preferences for all
using (user_id = auth.uid());

create policy "Users can manage their push tokens"
on push_tokens for all
using (user_id = auth.uid());

-- Rating and feedback tables
create table staff_ratings (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references staff(id) on delete cascade,
  shift_id uuid references shifts(id) on delete cascade,
  rated_by_id uuid references users(id) on delete restrict,
  rating decimal(2,1) not null check (rating between 1 and 5),
  feedback text,
  created_at timestamptz default now()
);

create table venue_ratings (
  id uuid primary key default uuid_generate_v4(),
  venue_id uuid references venues(id) on delete cascade,
  staff_id uuid references staff(id) on delete cascade,
  shift_id uuid references shifts(id) on delete cascade,
  rating decimal(2,1) not null check (rating between 1 and 5),
  feedback text,
  created_at timestamptz default now()
);

create table agency_reviews (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid references agencies(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  rating decimal(2,1) not null check (rating between 1 and 5),
  review text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for rating tables
create index idx_staff_ratings_staff on staff_ratings(staff_id);
create index idx_staff_ratings_shift on staff_ratings(shift_id);
create index idx_staff_ratings_rating on staff_ratings(rating);

create index idx_venue_ratings_venue on venue_ratings(venue_id);
create index idx_venue_ratings_staff on venue_ratings(staff_id);
create index idx_venue_ratings_shift on venue_ratings(shift_id);
create index idx_venue_ratings_rating on venue_ratings(rating);

create index idx_agency_reviews_agency on agency_reviews(agency_id);
create index idx_agency_reviews_company on agency_reviews(company_id);
create index idx_agency_reviews_rating on agency_reviews(rating);

-- RLS policies for rating tables
alter table staff_ratings enable row level security;
alter table venue_ratings enable row level security;
alter table agency_reviews enable row level security;

create policy "Companies can rate staff"
on staff_ratings for insert
using (
  exists (
    select 1 from shifts s
    join venues v on v.id = s.venue_id
    join companies c on c.id = v.company_id
    where s.id = shift_id
    and c.user_id = auth.uid()
  )
);

create policy "Staff can view their ratings"
on staff_ratings for select
using (
  staff_id in (
    select id from staff where user_id = auth.uid()
  )
  or exists (
    select 1 from agencies
    where id = (
      select agency_id from staff where id = staff_ratings.staff_id
    )
    and user_id = auth.uid()
  )
);

create policy "Staff can rate venues"
on venue_ratings for insert
using (
  staff_id in (
    select id from staff where user_id = auth.uid()
  )
);

create policy "Companies can view venue ratings"
on venue_ratings for select
using (
  exists (
    select 1 from venues v
    join companies c on c.id = v.company_id
    where v.id = venue_id
    and c.user_id = auth.uid()
  )
);

create policy "Companies can review agencies"
on agency_reviews for all
using (
  company_id in (
    select id from companies where user_id = auth.uid()
  )
);

create policy "Agencies can view their reviews"
on agency_reviews for select
using (
  agency_id in (
    select id from agencies where user_id = auth.uid()
  )
);

-- Functions to update average ratings
create or replace function update_staff_rating()
returns trigger as $$
begin
  update staff
  set rating = (
    select round(avg(rating)::numeric, 2)
    from staff_ratings
    where staff_id = NEW.staff_id
  )
  where id = NEW.staff_id;
  return NEW;
end;
$$ language plpgsql;

create or replace function update_agency_rating()
returns trigger as $$
begin
  update agencies
  set rating = (
    select round(avg(rating)::numeric, 2)
    from agency_reviews
    where agency_id = NEW.agency_id
  )
  where id = NEW.agency_id;
  return NEW;
end;
$$ language plpgsql;

-- Triggers for rating updates
create trigger update_staff_rating_trigger
after insert or update on staff_ratings
for each row execute function update_staff_rating();

create trigger update_agency_rating_trigger
after insert or update on agency_reviews
for each row execute function update_agency_rating();

-- Payment Methods policies
create index idx_payment_methods_user on payment_methods(user_id);
create index idx_payment_methods_stripe_id on payment_methods(stripe_payment_method_id);

alter table payment_methods enable row level security;

create policy "Users can manage their payment methods"
on payment_methods for all
using (user_id = auth.uid()); 