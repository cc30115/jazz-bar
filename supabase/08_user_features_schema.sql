-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 8
-- User Favorites & Tickets（使用者收藏 & 票券）
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ⚠️  Requires Parts 1-3 & 7 to be run first.
-- ============================================================


-- ── 1. USER FAVORITES（收藏 / 按讚）────────────────────────
-- Users can save/like events to view later on their Profile.
-- event_id is TEXT to support mock event identifiers.
-- When events come from the DB, this can be changed to UUID + FK.

CREATE TABLE IF NOT EXISTS user_favorites (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id       TEXT        NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, event_id)  -- one like per user per event
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user  ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_event ON user_favorites(event_id);

-- RLS: Users can only manage their own favorites
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);


-- ── 2. USER TICKETS（票券 / 訂票記錄）──────────────────────
-- Stores tickets purchased through Checkout, linked to the user.

CREATE TABLE IF NOT EXISTS user_tickets (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Event snapshot (preserved even if event is deleted)
  event_title     TEXT        NOT NULL,
  event_date      TEXT        NOT NULL,
  event_time      TEXT        NOT NULL,
  event_genre     TEXT,
  event_image     TEXT,

  -- Booking details
  seating_area    TEXT        NOT NULL,        -- e.g. 'Box Center'
  guest_count     INTEGER     NOT NULL DEFAULT 1,
  total_price     INTEGER     NOT NULL DEFAULT 0,
  booking_ref     TEXT        NOT NULL UNIQUE, -- e.g. 'YORU-XXXXXX'

  status          TEXT        NOT NULL DEFAULT 'confirmed'
                  CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),

  -- Metadata
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at (requires update_updated_at function from Part 3)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
    CREATE TRIGGER user_tickets_updated_at
      BEFORE UPDATE ON user_tickets
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_tickets_user   ON user_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tickets_ref    ON user_tickets(booking_ref);

-- RLS: Users can read their own tickets; only the system (service role) inserts
ALTER TABLE user_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tickets"
  ON user_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tickets"
  ON user_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all tickets (for management)
CREATE POLICY "Admins can read all tickets"
  ON user_tickets FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true
  );

CREATE POLICY "Admins full access to tickets"
  ON user_tickets FOR ALL
  USING (
    (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true
  );
