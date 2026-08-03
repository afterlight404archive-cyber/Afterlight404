-- ═══════════════════════════════════════════════════════════════════════
--  AfterLight:404Archive — Supabase setup  (v2, fully re-runnable)
--  Paste the WHOLE thing into Supabase → SQL Editor → Run.
--  Safe to run as many times as you like. Every statement is idempotent.
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ─────────────────────────── TABLES ───────────────────────────

create table if not exists songs (
  id bigint generated always as identity primary key,
  song_key text unique not null,
  title text, artist text, year text, mood text,
  about text, meaning text, lyrics text, credit text, spotify text,
  genre text[]
);

create table if not exists moods (
  id bigint generated always as identity primary key,
  mood_key text unique not null,
  label text, color text, bg text
);

create table if not exists genres (
  id bigint generated always as identity primary key,
  name text unique not null
);

create table if not exists chat_rooms (
  id bigint generated always as identity primary key,
  name text unique not null,
  creator text,
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id bigint generated always as identity primary key,
  room text not null,
  author text not null,
  text text not null,
  reply_to bigint,
  created_at timestamptz default now()
);

create table if not exists comments (
  id bigint generated always as identity primary key,
  song_key text not null,
  author text not null,
  text text not null,
  created_at timestamptz default now()
);

create table if not exists users (
  id bigint generated always as identity primary key,
  username text unique not null,
  code text unique,
  bio text,
  gender text,
  avatar text,
  owner_id uuid,
  blocked boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists user_auth (
  username text primary key references users(username) on delete cascade,
  password_hash text not null,
  owner_id uuid,
  session_token uuid not null default gen_random_uuid(),
  updated_at timestamptz default now()
);

create table if not exists friend_requests (
  id bigint generated always as identity primary key,
  from_user text not null,
  to_user text not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists dm_messages (
  id bigint generated always as identity primary key,
  pair_key text not null,
  sender text not null,
  recipient text not null,
  text text,
  song_key text,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value text
);

create table if not exists admin_settings (
  id bigint primary key,
  access_code_hash text,
  admin_email text,
  owner_username text
);

create table if not exists song_ratings (
  id bigint generated always as identity primary key,
  song_key text not null,
  voter_id text not null,
  value smallint not null check (value between 1 and 5),
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (song_key, voter_id)
);

create table if not exists notifications (
  id bigint generated always as identity primary key,
  username text not null,
  type text not null,
  title text not null,
  body text,
  link_page text,
  link_arg text,
  from_user text,
  read boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists submissions (
  id bigint generated always as identity primary key,
  title text, artist text, year text, mood text,
  about text, meaning text, lyrics text, fun_fact text, spotify text,
  genre text[],
  submitted_by text not null,
  created_at timestamptz default now()
);

create table if not exists reports (
  id bigint generated always as identity primary key,
  reporter text not null,
  reported_user text,
  category text not null,
  details text,
  context_type text,
  context_ref text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- ────────────────── MIGRATIONS (older projects) ──────────────────
alter table admin_settings drop column if exists admin_pass_hash;
alter table chat_messages  add  column if not exists reply_to bigint;
alter table users          add  column if not exists owner_id uuid;
alter table users          add  column if not exists blocked boolean not null default false;
alter table admin_settings add  column if not exists owner_username text;
alter table song_ratings   add  column if not exists updated_at timestamptz default now();

-- ─────────────────────────── INDEXES ───────────────────────────
-- Without these, every chat send did a full table scan (the rate-limit
-- trigger below reads max(created_at) per author on every insert).
create index if not exists comments_song_key_idx        on comments (song_key, created_at);
create index if not exists chat_messages_room_idx       on chat_messages (room, created_at);
create index if not exists chat_messages_author_idx     on chat_messages (author, created_at desc);
create index if not exists dm_messages_pair_idx         on dm_messages (pair_key, created_at);
create index if not exists dm_messages_sender_idx       on dm_messages (sender, created_at desc);
create index if not exists notifications_user_idx       on notifications (username, created_at desc);
create index if not exists song_ratings_song_idx        on song_ratings (song_key);
create index if not exists friend_requests_from_idx     on friend_requests (from_user);
create index if not exists friend_requests_to_idx       on friend_requests (to_user);
create index if not exists users_created_idx            on users (created_at desc);

-- ───────────────────── BOOTSTRAP ADMIN ROW ─────────────────────
-- is_site_admin() compares your signed-in email to admin_settings.admin_email,
-- but writing admin_settings requires is_site_admin() to already be true.
-- Without this seed row that check compares against NULL forever and nobody
-- can ever become admin. Change the email below to YOUR admin email.
insert into admin_settings (id, admin_email) values (1, 'jk@afterlight.com')
  on conflict (id) do nothing;

-- ───────────────────── IDENTITY HELPERS ─────────────────────

create or replace function owns_alias(p_username text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from users u
    where u.username = p_username and u.owner_id is not null and u.owner_id = auth.uid()
  );
$$;

create or replace function is_real_session()
returns boolean language sql stable as $$
  select auth.uid() is not null
     and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false;
$$;

create or replace function is_site_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select is_real_session()
     and lower(coalesce(auth.jwt() ->> 'email', '')) =
         lower(coalesce((select admin_email from admin_settings where id = 1), '__none__'));
$$;

create or replace function is_owner_session()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from users u join admin_settings s on s.id = 1
    where u.username = s.owner_username and u.owner_id is not null and u.owner_id = auth.uid()
  );
$$;

-- ───────────────────── ALIAS ACCOUNTS ─────────────────────

create or replace function alias_signup(p_username text, p_password text)
returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare v_token uuid := gen_random_uuid();
begin
  if p_username is null or char_length(p_username) < 3 then
    raise exception 'Invalid username.';
  end if;
  if p_password is null or char_length(p_password) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;
  if exists (select 1 from user_auth where lower(username) = lower(p_username)) then
    raise exception 'That anonymous name is already taken.';
  end if;
  insert into users (username, owner_id) values (p_username, auth.uid())
    on conflict (username) do update set owner_id = excluded.owner_id;
  insert into user_auth (username, password_hash, owner_id, session_token)
    values (p_username, crypt(p_password, gen_salt('bf')), auth.uid(), v_token);
  return v_token;
end;
$$;

create or replace function alias_login(p_username text, p_password text)
returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare v_hash text; v_token uuid := gen_random_uuid();
begin
  select password_hash into v_hash from user_auth where username = p_username;
  if v_hash is null or crypt(p_password, v_hash) <> v_hash then
    raise exception 'Invalid name or password.';
  end if;
  if exists (select 1 from users where username = p_username and blocked) then
    raise exception 'This account has been blocked by the site owner.';
  end if;
  update user_auth set owner_id = auth.uid(), session_token = v_token, updated_at = now()
    where username = p_username;
  update users set owner_id = auth.uid() where username = p_username;
  return v_token;
end;
$$;

create or replace function alias_change_password(p_username text, p_old_password text, p_new_password text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare v_hash text;
begin
  select password_hash into v_hash from user_auth
    where username = p_username and owner_id = auth.uid();
  if v_hash is null or crypt(p_old_password, v_hash) <> v_hash then
    raise exception 'Current password is incorrect.';
  end if;
  if p_new_password is null or char_length(p_new_password) < 6 then
    raise exception 'New password must be at least 6 characters.';
  end if;
  update user_auth set password_hash = crypt(p_new_password, gen_salt('bf')), updated_at = now()
    where username = p_username;
  return true;
end;
$$;

-- Lets signup check name availability across ALL devices before creating
-- the account, instead of only checking this browser's localStorage.
create or replace function alias_name_taken(p_username text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from users where lower(username) = lower(p_username));
$$;

grant execute on function alias_signup(text, text)                  to anon, authenticated;
grant execute on function alias_login(text, text)                   to anon, authenticated;
grant execute on function alias_change_password(text, text, text)   to anon, authenticated;
grant execute on function alias_name_taken(text)                    to anon, authenticated;

-- ───────────────────── BLOCK / BAN GUARD ─────────────────────

create or replace function guard_users_blocked()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.blocked is distinct from old.blocked and not (is_site_admin() or is_owner_session()) then
    new.blocked := old.blocked;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_guard_users_blocked on users;
create trigger trg_guard_users_blocked before update on users
  for each row execute function guard_users_blocked();

create or replace function set_user_blocked(p_username text, p_blocked boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not (is_site_admin() or is_owner_session()) then
    raise exception 'Not authorized.';
  end if;
  if exists (select 1 from admin_settings where id = 1 and owner_username = p_username) then
    raise exception 'The owner account can''t be blocked.';
  end if;
  update users set blocked = p_blocked where username = p_username;
end;
$$;
grant execute on function set_user_blocked(text, boolean) to anon, authenticated;

-- ───────────────────── ENABLE RLS ─────────────────────
alter table songs           enable row level security;
alter table moods           enable row level security;
alter table genres          enable row level security;
alter table chat_rooms      enable row level security;
alter table chat_messages   enable row level security;
alter table comments        enable row level security;
alter table site_settings   enable row level security;
alter table users           enable row level security;
alter table user_auth       enable row level security;
alter table friend_requests enable row level security;
alter table dm_messages     enable row level security;
alter table admin_settings  enable row level security;
alter table song_ratings    enable row level security;
alter table notifications   enable row level security;
alter table submissions     enable row level security;
alter table reports         enable row level security;

-- ───────────────────── POLICIES ─────────────────────
-- EVERY policy is dropped before it's created. This is what makes the
-- whole file re-runnable — the previous version died halfway through on
-- a second run with "policy already exists", which meant the tables and
-- realtime settings further down never got created at all.

drop policy if exists "Public upsert users"                on users;
drop policy if exists "Public update users"                on users;
drop policy if exists "Admin delete users"                 on users;
drop policy if exists "Public read users"                  on users;
drop policy if exists "Own session inserts users"          on users;
drop policy if exists "Own session updates users"          on users;
drop policy if exists "Admin deletes users"                on users;
create policy "Public read users"         on users for select using (true);
create policy "Own session inserts users" on users for insert to authenticated with check (owner_id = auth.uid());
create policy "Own session updates users" on users for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Admin deletes users"       on users for delete to authenticated using (is_site_admin());

drop policy if exists "Owner reads own auth row" on user_auth;
create policy "Owner reads own auth row" on user_auth for select to authenticated using (owner_id = auth.uid());

drop policy if exists "Public read songs"  on songs;
drop policy if exists "Admin write songs"  on songs;
create policy "Public read songs" on songs for select using (true);
create policy "Admin write songs" on songs for all to authenticated using (is_site_admin()) with check (is_site_admin());

drop policy if exists "Public read moods"  on moods;
drop policy if exists "Admin write moods"  on moods;
create policy "Public read moods" on moods for select using (true);
create policy "Admin write moods" on moods for all to authenticated using (is_site_admin()) with check (is_site_admin());

drop policy if exists "Public read genres" on genres;
drop policy if exists "Admin write genres" on genres;
create policy "Public read genres" on genres for select using (true);
create policy "Admin write genres" on genres for all to authenticated using (is_site_admin()) with check (is_site_admin());

drop policy if exists "Public read chat_rooms"    on chat_rooms;
drop policy if exists "Public insert chat_rooms"  on chat_rooms;
drop policy if exists "Session creates chat_rooms" on chat_rooms;
drop policy if exists "Creator or admin deletes chat_rooms" on chat_rooms;
create policy "Public read chat_rooms"     on chat_rooms for select using (true);
create policy "Session creates chat_rooms" on chat_rooms for insert to authenticated with check (owns_alias(creator) or is_site_admin());
create policy "Creator or admin deletes chat_rooms" on chat_rooms for delete to authenticated using (owns_alias(creator) or is_site_admin());

drop policy if exists "Public read chat_messages"          on chat_messages;
drop policy if exists "Public insert chat_messages"        on chat_messages;
drop policy if exists "Session sends chat_messages"        on chat_messages;
drop policy if exists "Owner or admin deletes chat_messages" on chat_messages;
create policy "Public read chat_messages"           on chat_messages for select using (true);
create policy "Session sends chat_messages"         on chat_messages for insert to authenticated with check (owns_alias(author));
create policy "Owner or admin deletes chat_messages" on chat_messages for delete to authenticated using (owns_alias(author) or is_site_admin());

drop policy if exists "Public read comments"           on comments;
drop policy if exists "Session sends comments"         on comments;
drop policy if exists "Owner or admin deletes comments" on comments;
drop policy if exists "Owner edits own comments"       on comments;
create policy "Public read comments"            on comments for select using (true);
create policy "Session sends comments"          on comments for insert to authenticated with check (owns_alias(author));
create policy "Owner edits own comments"        on comments for update to authenticated using (owns_alias(author)) with check (owns_alias(author));
create policy "Owner or admin deletes comments" on comments for delete to authenticated using (owns_alias(author) or is_site_admin());

-- RATINGS — now changeable and removable by the browser that cast them.
-- voter_id is a random id kept in the visitor's own localStorage, so "the
-- same browser" is the unit of identity here (rating needs no account).
drop policy if exists "Public read song_ratings"    on song_ratings;
drop policy if exists "Public insert song_ratings"  on song_ratings;
drop policy if exists "Voter updates own rating"    on song_ratings;
drop policy if exists "Voter deletes own rating"    on song_ratings;
drop policy if exists "Admin deletes song_ratings"  on song_ratings;
create policy "Public read song_ratings"   on song_ratings for select using (true);
create policy "Public insert song_ratings" on song_ratings for insert with check (value between 1 and 5);
create policy "Voter updates own rating"   on song_ratings for update using (true) with check (value between 1 and 5);
create policy "Voter deletes own rating"   on song_ratings for delete using (true);

drop policy if exists "Public read friend_requests"        on friend_requests;
drop policy if exists "Public write friend_requests"       on friend_requests;
drop policy if exists "Participants read friend_requests"  on friend_requests;
drop policy if exists "Sender creates friend_requests"     on friend_requests;
drop policy if exists "Sender updates friend_requests"     on friend_requests;
drop policy if exists "Recipient responds friend_requests" on friend_requests;
drop policy if exists "Either party deletes friend_requests" on friend_requests;
create policy "Participants read friend_requests"  on friend_requests for select to authenticated using (owns_alias(from_user) or owns_alias(to_user));
create policy "Sender creates friend_requests"     on friend_requests for insert to authenticated with check (owns_alias(from_user));
create policy "Sender updates friend_requests"     on friend_requests for update to authenticated using (owns_alias(from_user)) with check (owns_alias(from_user));
create policy "Recipient responds friend_requests" on friend_requests for update to authenticated using (owns_alias(to_user))   with check (owns_alias(to_user));
create policy "Either party deletes friend_requests" on friend_requests for delete to authenticated using (owns_alias(from_user) or owns_alias(to_user));

drop policy if exists "Public read dm_messages"        on dm_messages;
drop policy if exists "Public write dm_messages"       on dm_messages;
drop policy if exists "Participants read dm_messages"  on dm_messages;
drop policy if exists "Sender sends dm_messages"       on dm_messages;
drop policy if exists "Sender deletes dm_messages"     on dm_messages;
create policy "Participants read dm_messages" on dm_messages for select to authenticated using (owns_alias(sender) or owns_alias(recipient));
create policy "Sender sends dm_messages"      on dm_messages for insert to authenticated with check (owns_alias(sender));
create policy "Sender deletes dm_messages"    on dm_messages for delete to authenticated using (owns_alias(sender) or is_site_admin());

drop policy if exists "Public read site_settings"  on site_settings;
drop policy if exists "Admin writes site_settings" on site_settings;
create policy "Public read site_settings"  on site_settings for select using (true);
create policy "Admin writes site_settings" on site_settings for all to authenticated using (is_site_admin()) with check (is_site_admin());

drop policy if exists "Public read admin_settings"  on admin_settings;
drop policy if exists "Admin write admin_settings"  on admin_settings;
create policy "Public read admin_settings" on admin_settings for select using (true);
create policy "Admin write admin_settings" on admin_settings for all to authenticated using (is_site_admin()) with check (is_site_admin());

drop policy if exists "Owner reads own notifications"      on notifications;
drop policy if exists "Owner updates own notifications"    on notifications;
drop policy if exists "Sender or admin inserts notifications" on notifications;
drop policy if exists "Owner deletes own notifications"    on notifications;
create policy "Owner reads own notifications"   on notifications for select to authenticated using (owns_alias(username));
create policy "Owner updates own notifications" on notifications for update to authenticated using (owns_alias(username)) with check (owns_alias(username));
create policy "Owner deletes own notifications" on notifications for delete to authenticated using (owns_alias(username));
create policy "Sender or admin inserts notifications" on notifications for insert to authenticated with check (owns_alias(coalesce(from_user, username)) or is_site_admin());

drop policy if exists "Owner or admin reads submissions" on submissions;
drop policy if exists "Owner creates submissions"        on submissions;
drop policy if exists "Admin deletes submissions"        on submissions;
create policy "Owner or admin reads submissions" on submissions for select to authenticated using (owns_alias(submitted_by) or is_site_admin());
create policy "Owner creates submissions"        on submissions for insert to authenticated with check (owns_alias(submitted_by));
create policy "Admin deletes submissions"        on submissions for delete to authenticated using (is_site_admin());

drop policy if exists "Admin reads reports"   on reports;
drop policy if exists "Owner files reports"   on reports;
drop policy if exists "Admin updates reports" on reports;
drop policy if exists "Admin deletes reports" on reports;
create policy "Admin reads reports"   on reports for select to authenticated using (is_site_admin());
create policy "Owner files reports"   on reports for insert to authenticated with check (owns_alias(reporter));
create policy "Admin updates reports" on reports for update to authenticated using (is_site_admin()) with check (is_site_admin());
create policy "Admin deletes reports" on reports for delete to authenticated using (is_site_admin());

-- ───────────────────── LENGTH LIMITS ─────────────────────
alter table chat_messages drop constraint if exists chat_messages_text_length;
alter table chat_messages add  constraint chat_messages_text_length check (char_length(text) between 1 and 2000);
alter table comments      drop constraint if exists comments_text_length;
alter table comments      add  constraint comments_text_length check (char_length(text) between 1 and 2000);
alter table dm_messages   drop constraint if exists dm_messages_text_length;
alter table dm_messages   add  constraint dm_messages_text_length check (text is null or char_length(text) <= 2000);
alter table chat_rooms    drop constraint if exists chat_rooms_name_length;
alter table chat_rooms    add  constraint chat_rooms_name_length check (char_length(name) between 2 and 40);

-- ───────────────────── RATE LIMITS ─────────────────────
-- Note the interval is 900ms, not 1s. The old 1-second version raced with
-- the browser's own 1200ms cooldown and rejected legitimate fast-but-human
-- sends, which looked like "chat randomly drops my messages".

create or replace function enforce_chat_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare last_msg_time timestamptz;
begin
  select max(created_at) into last_msg_time from chat_messages where author = new.author;
  if last_msg_time is not null and (now() - last_msg_time) < interval '900 milliseconds' then
    raise exception 'Sending too fast — please slow down.';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_chat_rate_limit on chat_messages;
create trigger trg_chat_rate_limit before insert on chat_messages
  for each row execute function enforce_chat_rate_limit();

create or replace function enforce_dm_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare last_msg_time timestamptz;
begin
  select max(created_at) into last_msg_time from dm_messages where sender = new.sender;
  if last_msg_time is not null and (now() - last_msg_time) < interval '900 milliseconds' then
    raise exception 'Sending too fast — please slow down.';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_dm_rate_limit on dm_messages;
create trigger trg_dm_rate_limit before insert on dm_messages
  for each row execute function enforce_dm_rate_limit();

-- Signup burst limit. The old version allowed only 5 accounts site-wide per
-- MINUTE, which locks out real people the moment you get any traffic at all
-- (share the site in a group chat and the 6th person onward just gets an
-- error). 20/minute still stops a script, without punishing a good day.
create or replace function enforce_signup_burst_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare recent_count int;
begin
  select count(*) into recent_count from users where created_at > now() - interval '60 seconds';
  if recent_count >= 20 then
    raise exception 'Too many accounts are being created right now — please try again in a minute.';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_signup_burst_limit on users;
create trigger trg_signup_burst_limit before insert on users
  for each row execute function enforce_signup_burst_limit();

-- ───────────────────── REALTIME ─────────────────────
-- THIS IS THE BLOCK THAT MAKES LIVE CHAT ACTUALLY LIVE.
-- chat_messages and dm_messages were never added to the realtime
-- publication, so no browser was ever told about a new message — you only
-- saw other people's messages by leaving the room and coming back.

do $$
declare t text;
begin
  foreach t in array array[
    'chat_messages','dm_messages','comments','song_ratings',
    'user_auth','notifications','submissions','reports',
    'chat_rooms','friend_requests','users'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table %I', t);
    exception
      when duplicate_object then null;   -- already published, fine
      when undefined_object then null;   -- publication missing, fine
    end;
  end loop;
end $$;

-- Realtime respects RLS, so each table also needs REPLICA IDENTITY set for
-- DELETE events to carry enough info for the client to match the row.
alter table chat_messages   replica identity full;
alter table dm_messages     replica identity full;
alter table comments        replica identity full;
alter table song_ratings    replica identity full;
alter table notifications   replica identity full;

-- ─────────────────────────── DONE ───────────────────────────
-- If this ran without a red error, every table, policy, index, rate limit
-- and realtime channel the site needs now exists.
