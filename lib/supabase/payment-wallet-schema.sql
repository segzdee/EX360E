-- Create payment related enums
create type payment_provider as enum (
    'stripe',
    'crypto',
    'bank_transfer',
    'mobile_money',
    'sepa',
    'apple_pay',
    'google_pay',
    'wallet'
);

create type payment_status as enum (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
    'disputed'
);

create type transaction_type as enum (
    'deposit',
    'withdrawal',
    'transfer',
    'payment',
    'refund',
    'fee',
    'escrow'
);

create type wallet_transaction_status as enum (
    'pending',
    'completed',
    'failed',
    'cancelled'
);

-- Create wallets table
create table public.wallets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles on delete cascade,
    balance numeric default 0,
    currency text default 'USD',
    is_active boolean default true,
    last_transaction_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint positive_balance check (balance >= 0)
);

-- Create payment_methods table for saved payment methods
create table public.payment_methods (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles on delete cascade,
    provider payment_provider not null,
    is_default boolean default false,
    details jsonb not null, -- Encrypted payment details
    metadata jsonb,
    last_used_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create wallet_transactions table
create table public.wallet_transactions (
    id uuid default uuid_generate_v4() primary key,
    wallet_id uuid references public.wallets on delete cascade,
    transaction_type transaction_type not null,
    amount numeric not null,
    balance_after numeric not null,
    status wallet_transaction_status default 'pending',
    description text,
    metadata jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create payment_transactions table
create table public.payment_transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles on delete cascade,
    payment_method_id uuid references public.payment_methods,
    wallet_transaction_id uuid references public.wallet_transactions,
    amount numeric not null,
    currency text default 'USD',
    provider payment_provider not null,
    provider_transaction_id text,
    status payment_status default 'pending',
    fee_amount numeric default 0,
    metadata jsonb,
    error_message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create withdrawals table
create table public.withdrawals (
    id uuid default uuid_generate_v4() primary key,
    wallet_id uuid references public.wallets on delete cascade,
    payment_transaction_id uuid references public.payment_transactions,
    amount numeric not null,
    fee_amount numeric default 0,
    status wallet_transaction_status default 'pending',
    withdrawal_method jsonb not null, -- Bank details, crypto wallet, etc.
    processed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint positive_withdrawal check (amount > 0)
);

-- Create escrow_accounts table
create table public.escrow_accounts (
    id uuid default uuid_generate_v4() primary key,
    shift_id uuid references public.shifts on delete cascade,
    amount numeric not null,
    status payment_status default 'pending',
    release_at timestamptz,
    released_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Add indexes
create index idx_wallets_user on public.wallets(user_id);
create index idx_payment_methods_user on public.payment_methods(user_id);
create index idx_wallet_transactions_wallet on public.wallet_transactions(wallet_id);
create index idx_payment_transactions_user on public.payment_transactions(user_id);
create index idx_withdrawals_wallet on public.withdrawals(wallet_id);
create index idx_escrow_accounts_shift on public.escrow_accounts(shift_id);

-- Enable Row Level Security
alter table public.wallets enable row level security;
alter table public.payment_methods enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.withdrawals enable row level security;
alter table public.escrow_accounts enable row level security;

-- Create policies
create policy "Users can view their own wallet"
    on public.wallets for select
    using (auth.uid() = user_id);

create policy "Users can view their own payment methods"
    on public.payment_methods for select
    using (auth.uid() = user_id);

create policy "Users can view their own transactions"
    on public.wallet_transactions for select
    using (
        exists (
            select 1 from public.wallets
            where id = wallet_transactions.wallet_id
            and user_id = auth.uid()
        )
    );

-- Create functions for wallet operations
create or replace function public.create_wallet(
    p_user_id uuid,
    p_currency text default 'USD'
)
returns uuid as $$
declare
    v_wallet_id uuid;
begin
    insert into public.wallets (user_id, currency)
    values (p_user_id, p_currency)
    returning id into v_wallet_id;
    
    return v_wallet_id;
end;
$$ language plpgsql security definer;

create or replace function public.process_wallet_transaction(
    p_wallet_id uuid,
    p_amount numeric,
    p_type transaction_type,
    p_description text default null
)
returns uuid as $$
declare
    v_current_balance numeric;
    v_new_balance numeric;
    v_transaction_id uuid;
begin
    -- Get current balance
    select balance into v_current_balance
    from public.wallets
    where id = p_wallet_id
    for update;
    
    -- Calculate new balance
    if p_type in ('deposit', 'refund') then
        v_new_balance := v_current_balance + p_amount;
    elsif p_type in ('withdrawal', 'payment') then
        v_new_balance := v_current_balance - p_amount;
        -- Check sufficient balance
        if v_new_balance < 0 then
            raise exception 'Insufficient balance';
        end if;
    end if;
    
    -- Create transaction record
    insert into public.wallet_transactions (
        wallet_id,
        transaction_type,
        amount,
        balance_after,
        description,
        status
    )
    values (
        p_wallet_id,
        p_type,
        p_amount,
        v_new_balance,
        p_description,
        'completed'
    )
    returning id into v_transaction_id;
    
    -- Update wallet balance
    update public.wallets
    set balance = v_new_balance,
        last_transaction_at = now()
    where id = p_wallet_id;
    
    return v_transaction_id;
end;
$$ language plpgsql security definer;

-- Create escrow management functions
create or replace function public.create_escrow(
    p_shift_id uuid,
    p_amount numeric
)
returns uuid as $$
declare
    v_escrow_id uuid;
begin
    insert into public.escrow_accounts (
        shift_id,
        amount,
        status,
        release_at
    )
    values (
        p_shift_id,
        p_amount,
        'pending',
        (select end_time from public.shifts where id = p_shift_id)
    )
    returning id into v_escrow_id;
    
    return v_escrow_id;
end;
$$ language plpgsql security definer;

-- Create triggers
create or replace function public.update_wallet_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger wallet_timestamp
    before update on public.wallets
    for each row
    execute function public.update_wallet_timestamp();

-- Add wallet creation trigger for new users
create or replace function public.create_user_wallet()
returns trigger as $$
begin
    perform public.create_wallet(new.id);
    return new;
end;
$$ language plpgsql security definer;

create trigger on_user_created
    after insert on public.profiles
    for each row
    execute function public.create_user_wallet();