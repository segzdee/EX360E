-- Agency Analytics
create or replace function get_agency_analytics(
  p_agency_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
) returns jsonb as $$
declare
  v_result jsonb;
begin
  with revenue_data as (
    select
      date_trunc('month', p.payment_date) as month,
      sum(p.amount) as value
    from payments p
    join shift_assignments sa on sa.id = p.shift_id
    join staff s on s.id = sa.staff_id
    where s.agency_id = p_agency_id
    and p.payment_date between p_start_date and p_end_date
    group by date_trunc('month', p.payment_date)
  ),
  staff_data as (
    select
      s.id,
      s.name,
      s.rating,
      count(sa.id) as shifts_completed,
      sum(p.amount) as revenue_generated
    from staff s
    left join shift_assignments sa on sa.staff_id = s.id
    left join payments p on p.shift_id = sa.id
    where s.agency_id = p_agency_id
    and (sa.created_at between p_start_date and p_end_date or sa.id is null)
    group by s.id, s.name, s.rating
  ),
  shift_data as (
    select
      count(*) as total,
      sum(case when status = 'Completed' then 1 else 0 end) as completed,
      sum(case when status = 'Cancelled' then 1 else 0 end) as cancelled,
      sum(case when status = 'Scheduled' and start_time > now() then 1 else 0 end) as upcoming,
      jsonb_object_agg(status, count(*)) as by_status,
      jsonb_agg(
        jsonb_build_object(
          'venue_id', v.id,
          'venue_name', v.name,
          'total_shifts', count(*),
          'total_revenue', sum(s.hourly_rate * extract(epoch from (s.end_time - s.start_time))/3600)
        )
      ) as by_venue
    from shifts s
    join venues v on v.id = s.venue_id
    where s.created_at between p_start_date and p_end_date
    group by v.id, v.name
  ),
  client_data as (
    select
      count(distinct c.id) as total,
      count(distinct case when s.id is not null then c.id end) as active,
      count(distinct case when c.created_at between p_start_date and p_end_date then c.id end) as new,
      jsonb_object_agg(c.industry, count(*)) as by_industry
    from companies c
    left join venues v on v.company_id = c.id
    left join shifts s on s.venue_id = v.id
    where s.created_at between p_start_date and p_end_date
    group by c.industry
  ),
  performance_data as (
    select
      jsonb_agg(
        jsonb_build_object(
          'date', date_trunc('day', s.created_at),
          'shifts_completed', count(case when s.status = 'Completed' then 1 end),
          'revenue', sum(p.amount)
        )
        order by date_trunc('day', s.created_at)
      ) filter (where s.created_at >= date_trunc('week', now()) - interval '1 week') as weekly_performance,
      jsonb_agg(
        jsonb_build_object(
          'date', date_trunc('month', s.created_at),
          'shifts_completed', count(case when s.status = 'Completed' then 1 end),
          'revenue', sum(p.amount)
        )
        order by date_trunc('month', s.created_at)
      ) as monthly_trend
    from shifts s
    left join payments p on p.shift_id = s.id
    where s.created_at between p_start_date and p_end_date
  )
  select jsonb_build_object(
    'revenue', jsonb_build_object(
      'total', (select sum(value) from revenue_data),
      'growth', (
        select (
          sum(case when month >= date_trunc('month', p_end_date - interval '1 month') then value else 0 end) -
          sum(case when month >= date_trunc('month', p_end_date - interval '2 months') 
              and month < date_trunc('month', p_end_date - interval '1 month') then value else 0 end)
        ) / nullif(
          sum(case when month >= date_trunc('month', p_end_date - interval '2 months') 
              and month < date_trunc('month', p_end_date - interval '1 month') then value else 0 end
          ), 0) * 100
        from revenue_data
      ),
      'byMonth', (
        select jsonb_agg(
          jsonb_build_object(
            'month', to_char(month, 'Mon YYYY'),
            'value', value
          )
        )
        from revenue_data
      )
    ),
    'staff', (
      select jsonb_build_object(
        'total', count(*),
        'active', count(case when status = 'Available' then 1 end),
        'utilization', (
          count(case when status = 'On Shift' then 1 end)::float / 
          nullif(count(*), 0) * 100
        ),
        'performance', (
          select jsonb_agg(
            jsonb_build_object(
              'id', id,
              'name', name,
              'rating', rating,
              'shifts_completed', shifts_completed,
              'revenue_generated', revenue_generated
            )
          )
          from staff_data
        )
      )
      from staff
      where agency_id = p_agency_id
    ),
    'shifts', (
      select jsonb_build_object(
        'total', total,
        'completed', completed,
        'cancelled', cancelled,
        'upcoming', upcoming,
        'byStatus', by_status,
        'byVenue', by_venue
      )
      from shift_data
    ),
    'clients', (
      select jsonb_build_object(
        'total', total,
        'active', active,
        'new', new,
        'byIndustry', by_industry
      )
      from client_data
    ),
    'performance', (
      select jsonb_build_object(
        'weekly', weekly_performance,
        'monthly', monthly_trend
      )
      from performance_data
    ),
    'ticker', jsonb_build_object(
      'active_jobs', (
        select count(*) 
        from shifts s 
        where s.status = 'posted'
        and s.created_at between p_start_date and p_end_date
      ),
      'staff_placed', (
        select count(distinct sa.staff_id)
        from shift_assignments sa
        where sa.created_at between p_start_date and p_end_date
      ),
      'companies', (
        select count(distinct c.id)
        from companies c
        where c.created_at between p_start_date and p_end_date
      ),
      'agencies', (
        select count(distinct a.id)
        from recruiters a
        where a.created_at between p_start_date and p_end_date
      )
    )
  ) into v_result;

  return v_result;
end;
$$ language plpgsql;

-- Company Analytics
create or replace function get_company_analytics(
  p_company_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
) returns jsonb as $$
declare
  v_result jsonb;
begin
  with spending_data as (
    select
      date_trunc('month', p.payment_date) as month,
      sum(p.amount) as value,
      v.id as venue_id,
      v.name as venue_name
    from payments p
    join shifts s on s.id = p.shift_id
    join venues v on v.id = s.venue_id
    where v.company_id = p_company_id
    and p.payment_date between p_start_date and p_end_date
    group by date_trunc('month', p.payment_date), v.id, v.name
  ),
  shift_data as (
    select
      count(*) as total,
      sum(case when s.status = 'Completed' then 1 else 0 end) as completed,
      sum(case when s.status = 'Cancelled' then 1 else 0 end) as cancelled,
      avg(s.staff_assigned::float / nullif(s.staff_needed, 0)) * 100 as staffing_rate,
      jsonb_object_agg(s.status, count(*)) as by_status
    from shifts s
    join venues v on v.id = s.venue_id
    where v.company_id = p_company_id
    and s.created_at between p_start_date and p_end_date
    group by s.status
  ),
  staff_data as (
    select
      count(distinct sa.staff_id) as total_worked,
      avg(sr.rating) as average_rating,
      jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'rating', s.rating,
          'shifts_completed', count(sa.id)
        )
        order by s.rating desc
        limit 10
      ) as top_performers
    from shift_assignments sa
    join staff s on s.id = sa.staff_id
    join shifts sh on sh.id = sa.shift_id
    join venues v on v.id = sh.venue_id
    left join staff_ratings sr on sr.staff_id = s.id
    where v.company_id = p_company_id
    and sa.created_at between p_start_date and p_end_date
    group by s.id, s.name
  ),
  venue_data as (
    select
      count(*) as total,
      count(case when exists (
        select 1 from shifts s
        where s.venue_id = v.id
        and s.created_at between p_start_date and p_end_date
      ) then 1 end) as active,
      jsonb_agg(
        jsonb_build_object(
          'id', v.id,
          'name', v.name,
          'total_shifts', count(s.id),
          'average_rating', avg(sr.rating),
          'total_spent', sum(p.amount)
        )
      ) as performance
    from venues v
    left join shifts s on s.venue_id = v.id
    left join shift_assignments sa on sa.shift_id = s.id
    left join staff_ratings sr on sr.staff_id = sa.staff_id
    left join payments p on p.shift_id = s.id
    where v.company_id = p_company_id
    and (s.created_at between p_start_date and p_end_date or s.id is null)
    group by v.id, v.name
  )
  select jsonb_build_object(
    'spending', jsonb_build_object(
      'total', (select sum(value) from spending_data),
      'byMonth', (
        select jsonb_agg(
          jsonb_build_object(
            'month', to_char(month, 'Mon YYYY'),
            'value', sum(value)
          )
        )
        from spending_data
        group by month
      ),
      'byVenue', (
        select jsonb_agg(
          jsonb_build_object(
            'venue_id', venue_id,
            'venue_name', venue_name,
            'total_spent', sum(value)
          )
        )
        from spending_data
        group by venue_id, venue_name
      )
    ),
    'shifts', (
      select jsonb_build_object(
        'total', total,
        'completed', completed,
        'cancelled', cancelled,
        'staffing_rate', staffing_rate,
        'byStatus', by_status
      )
      from shift_data
    ),
    'staff', (
      select jsonb_build_object(
        'total_worked', total_worked,
        'average_rating', average_rating,
        'top_performers', top_performers
      )
      from staff_data
    ),
    'venues', (
      select jsonb_build_object(
        'total', total,
        'active', active,
        'performance', performance
      )
      from venue_data
    )
  ) into v_result;

  return v_result;
end;
$$ language plpgsql;

-- Staff Analytics
create or replace function get_staff_analytics(
  p_staff_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
) returns jsonb as $$
declare
  v_result jsonb;
begin
  with earnings_data as (
    select
      date_trunc('month', p.payment_date) as month,
      sum(p.amount) as value,
      v.id as venue_id,
      v.name as venue_name
    from payments p
    join shift_assignments sa on sa.id = p.shift_id
    join shifts s on s.id = sa.shift_id
    join venues v on v.id = s.venue_id
    where sa.staff_id = p_staff_id
    and p.payment_date between p_start_date and p_end_date
    group by date_trunc('month', p.payment_date), v.id, v.name
  ),
  shift_data as (
    select
      count(*) as total,
      sum(case when sa.status = 'Checked Out' then 1 else 0 end) as completed,
      sum(case when sa.status = 'Cancelled' then 1 else 0 end) as cancelled,
      sum(case when s.start_time > now() then 1 else 0 end) as upcoming,
      jsonb_object_agg(sa.status, count(*)) as by_status
    from shift_assignments sa
    join shifts s on s.id = sa.shift_id
    where sa.staff_id = p_staff_id
    and sa.created_at between p_start_date and p_end_date
    group by sa.status
  ),
  performance_data as (
    select
      avg(sr.rating) as average_rating,
      sum(
        extract(epoch from (sa.check_out_time - sa.check_in_time))/3600
      ) as total_hours,
      jsonb_object_agg(
        sr.rating::text,
        count(*)
      ) as ratings_breakdown,
      jsonb_agg(
        jsonb_build_object(
          'shift_id', sr.shift_id,
          'rating', sr.rating,
          'comment', sr.feedback,
          'date', sr.created_at
        )
        order by sr.created_at desc
      ) as feedback
    from staff_ratings sr
    join shift_assignments sa on sa.id = sr.shift_id
    where sr.staff_id = p_staff_id
    and sr.created_at between p_start_date and p_end_date
    group by sr.rating
  ),
  availability_data as (
    select
      (
        count(case when sa.status = 'Checked Out' then 1 end)::float /
        nullif(count(*), 0) * 100
      ) as utilization_rate,
      array_agg(distinct v.name) as preferred_venues,
      jsonb_agg(
        jsonb_build_object(
          'day', to_char(s.start_time, 'Day'),
          'start_time', to_char(s.start_time, 'HH24:MI'),
          'end_time', to_char(s.end_time, 'HH24:MI'),
          'frequency', count(*)
        )
      ) as common_shift_times
    from shift_assignments sa
    join shifts s on s.id = sa.shift_id
    join venues v on v.id = s.venue_id
    where sa.staff_id = p_staff_id
    and sa.created_at between p_start_date and p_end_date
    group by to_char(s.start_time, 'Day'),
             to_char(s.start_time, 'HH24:MI'),
             to_char(s.end_time, 'HH24:MI')
  )
  select jsonb_build_object(
    'earnings', jsonb_build_object(
      'total', (select sum(value) from earnings_data),
      'byMonth', (
        select jsonb_agg(
          jsonb_build_object(
            'month', to_char(month, 'Mon YYYY'),
            'value', sum(value)
          )
        )
        from earnings_data
        group by month
      ),
      'byVenue', (
        select jsonb_agg(
          jsonb_build_object(
            'venue_id', venue_id,
            'venue_name', venue_name,
            'total_earned', sum(value)
          )
        )
        from earnings_data
        group by venue_id, venue_name
      )
    ),
    'shifts', (
      select jsonb_build_object(
        'total', total,
        'completed', completed,
        'cancelled', cancelled,
        'upcoming', upcoming,
        'byStatus', by_status
      )
      from shift_data
    ),
    'performance', (
      select jsonb_build_object(
        'average_rating', average_rating,
        'total_hours', total_hours,
        'ratings_breakdown', ratings_breakdown,
        'feedback', feedback
      )
      from performance_data
    ),
    'availability', (
      select jsonb_build_object(
        'utilization_rate', utilization_rate,
        'preferred_venues', preferred_venues,
        'common_shift_times', common_shift_times
      )
      from availability_data
    )
  ) into v_result;

  return v_result;
end;
$$ language plpgsql;

-- Custom Report Generation
create or replace function generate_custom_report(
  p_entity_type text,
  p_entity_id uuid,
  p_metrics text[],
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_grouping text default 'monthly'
) returns jsonb as $$
declare
  v_result jsonb;
  v_metric text;
  v_sql text;
  v_group_by text;
begin
  -- Set grouping interval
  case p_grouping
    when 'daily' then v_group_by := 'day';
    when 'weekly' then v_group_by := 'week';
    else v_group_by := 'month';
  end case;

  -- Initialize result
  v_result := '{}';

  -- Generate report for each metric
  foreach v_metric in array p_metrics
  loop
    case
      when p_entity_type = 'agency' then
        case v_metric
          when 'revenue' then
            v_sql := format(
              'select
                date_trunc(%L, p.payment_date) as period,
                sum(p.amount) as value
              from payments p
              join shift_assignments sa on sa.id = p.shift_id
              join staff s on s.id = sa.staff_id
              where s.agency_id = %L
              and p.payment_date between %L and %L
              group by date_trunc(%L, p.payment_date)',
              v_group_by, p_entity_id, p_start_date, p_end_date, v_group_by
            );
          -- Add more agency metrics here
        end case;
      
      when p_entity_type = 'company' then
        case v_metric
          when 'spending' then
            v_sql := format(
              'select
                date_trunc(%L, p.payment_date) as period,
                sum(p.amount) as value
              from payments p
              join shifts s on s.id = p.shift_id
              join venues v on v.id = s.venue_id
              where v.company_id = %L
              and p.payment_date between %L and %L
              group by date_trunc(%L, p.payment_date)',
              v_group_by, p_entity_id, p_start_date, p_end_date, v_group_by
            );
          -- Add more company metrics here
        end case;
      
      when p_entity_type = 'staff' then
        case v_metric
          when 'earnings' then
            v_sql := format(
              'select
                date_trunc(%L, p.payment_date) as period,
                sum(p.amount) as value
              from payments p
              join shift_assignments sa on sa.id = p.shift_id
              where sa.staff_id = %L
              and p.payment_date between %L and %L
              group by date_trunc(%L, p.payment_date)',
              v_group_by, p_entity_id, p_start_date, p_end_date, v_group_by
            );
          -- Add more staff metrics here
        end case;
    end case;

    -- Execute query and add to result
    if v_sql is not null then
      v_result := v_result || jsonb_build_object(
        v_metric,
        (
          select jsonb_agg(
            jsonb_build_object(
              'period', to_char(period, 'YYYY-MM-DD'),
              'value', value
            )
          )
          from execute v_sql
        )
      );
    end if;
  end loop;

  return v_result;
end;
$$ language plpgsql; 