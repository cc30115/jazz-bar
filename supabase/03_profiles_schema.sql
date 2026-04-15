-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 3
-- User Profiles & Membership（會員系統）
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ⚠️  Requires Part 1 (01_events_schema.sql) to be run first.
-- ⚠️  Requires Supabase Auth to be enabled on the project.
-- ============================================================


-- ── 1. ENUM TYPES ───────────────────────────────────────────

CREATE TYPE membership_tier AS ENUM (
  'bronze',    -- 銅級
  'silver',    -- 銀級
  'gold',      -- 金級 → "Gold Patron"
  'platinum'   -- 白金級
);


-- ── 2. MEMBERSHIP_TIERS（等級靜態設定）──────────────────────
-- 後台管理的升級門檻與福利，避免 hardcode 在前端

CREATE TABLE membership_tiers (
  id                      UUID    PRIMARY KEY DEFAULT gen_random_uuid(),

  tier_key                membership_tier  NOT NULL UNIQUE,  -- 對應 ENUM

  label_en                TEXT    NOT NULL,       -- e.g. "Gold Patron"
  label_ja                TEXT,                   -- e.g. "ゴールドパトロン"

  min_points              INTEGER NOT NULL,       -- 進入此等級最低點數
  max_points              INTEGER,               -- 此等級上限（NULL = 最高級）

  -- 福利（JSONB 可靈活擴充）
  perks                   JSONB   NOT NULL DEFAULT '[]'::jsonb,  -- Array of strings
  priority_hours_early    INTEGER NOT NULL DEFAULT 0,            -- 提前幾小時可訂位

  -- 視覺
  color_hex               TEXT,                   -- e.g. "#C9A96E" (金色)
  badge_icon              TEXT,                   -- e.g. "⭐", or icon slug

  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER membership_tiers_updated_at
  BEFORE UPDATE ON membership_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── 3. PROFILES（擴充 Supabase auth.users）──────────────────
-- id 與 auth.users.id 一致（UUID），1-to-1 關係

CREATE TABLE profiles (
  id                      UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基本資訊
  display_name            TEXT,
  phone                   TEXT,

  -- 會員
  member_since            DATE    NOT NULL DEFAULT CURRENT_DATE,
  tier                    membership_tier NOT NULL DEFAULT 'bronze',
  reward_points           INTEGER NOT NULL DEFAULT 0 CHECK (reward_points >= 0),

  -- 頭像
  avatar_url              TEXT,

  -- Email 偏好
  email_prefs_newsletter  BOOLEAN NOT NULL DEFAULT true,
  email_prefs_events      BOOLEAN NOT NULL DEFAULT false,

  -- Metadata
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_profiles_tier ON profiles(tier);


-- ── 4. AUTO-CREATE PROFILE ON SIGNUP ────────────────────────
-- 新用戶註冊後自動建立 profile 記錄

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── 5. REWARD POINTS & TIER AUTO-UPDATE ─────────────────────
-- 每次 reservation 變成 confirmed → 自動累積點數 & 升等

CREATE OR REPLACE FUNCTION award_points_on_confirmation()
RETURNS TRIGGER AS $$
DECLARE
  pts_to_add INTEGER;
  new_tier   membership_tier;
BEGIN
  -- 只在 status 由 非confirmed → confirmed 時觸發
  IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM 'confirmed') THEN

    -- 每 1,000 JPY 得 1 點（無條件捨去）
    pts_to_add := FLOOR(NEW.total_price / 1000);

    -- 有 user_id 才累積
    IF NEW.user_id IS NOT NULL THEN
      UPDATE profiles
      SET reward_points = reward_points + pts_to_add
      WHERE id = NEW.user_id;

      -- 根據新點數決定 tier
      SELECT tier_key INTO new_tier
      FROM membership_tiers
      WHERE min_points <= (SELECT reward_points FROM profiles WHERE id = NEW.user_id)
        AND (max_points IS NULL OR max_points >= (SELECT reward_points FROM profiles WHERE id = NEW.user_id))
      ORDER BY min_points DESC
      LIMIT 1;

      IF new_tier IS NOT NULL THEN
        UPDATE profiles
        SET tier = new_tier
        WHERE id = NEW.user_id;
      END IF;
    END IF;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER reservations_award_points
  AFTER UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION award_points_on_confirmation();


-- ── 6. ROW LEVEL SECURITY (RLS) ─────────────────────────────

ALTER TABLE membership_tiers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;

-- Membership Tiers：所有人可讀（公開福利說明）
CREATE POLICY "Public read membership_tiers"
  ON membership_tiers FOR SELECT USING (true);

-- Profiles：只有本人可讀寫自己的 profile
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 新用戶 profile 由 trigger（SECURITY DEFINER）自動建立，不需要 INSERT policy


-- ── 7. USEFUL VIEWS ──────────────────────────────────────────

-- 會員完整資訊（含等級福利）
CREATE OR REPLACE VIEW profile_with_tier AS
SELECT
  p.id,
  p.display_name,
  p.phone,
  p.avatar_url,
  p.member_since,
  p.tier,
  p.reward_points,
  p.email_prefs_newsletter,
  p.email_prefs_events,
  p.created_at,
  -- Tier info
  mt.label_en         AS tier_label,
  mt.label_ja         AS tier_label_ja,
  mt.perks            AS tier_perks,
  mt.priority_hours_early,
  mt.color_hex        AS tier_color,
  mt.badge_icon       AS tier_badge,
  mt.min_points       AS tier_min_points,
  mt.max_points       AS tier_max_points
FROM profiles p
JOIN membership_tiers mt ON mt.tier_key = p.tier;


-- ── 8. SAMPLE DATA ───────────────────────────────────────────

-- 會員等級設定
INSERT INTO membership_tiers (tier_key, label_en, label_ja, min_points, max_points, perks, priority_hours_early, color_hex, badge_icon) VALUES
(
  'bronze',
  'Bronze Member',
  'ブロンズ会員',
  0, 499,
  '["Early access to event listings", "Monthly newsletter"]'::jsonb,
  0,
  '#CD7F32',
  '🥉'
),
(
  'silver',
  'Silver Member',
  'シルバー会員',
  500, 1999,
  '["Early access to event listings", "Monthly newsletter", "Priority reservation window +6 hours", "10% discount on Box seats"]'::jsonb,
  6,
  '#A8A9AD',
  '🥈'
),
(
  'gold',
  'Gold Patron',
  'ゴールドパトロン',
  2000, 4999,
  '["All Silver benefits", "Priority reservation window +24 hours", "Complimentary welcome drink", "Access to member-only events", "15% discount on all seating"]'::jsonb,
  24,
  '#C9A96E',
  '⭐'
),
(
  'platinum',
  'Platinum Patron',
  'プラチナパトロン',
  5000, NULL,
  '["All Gold benefits", "Priority reservation window +48 hours", "Dedicated concierge service", "Annual private listening session", "20% discount + free seat upgrade when available"]'::jsonb,
  48,
  '#E5E4E2',
  '💎'
);


-- ── 完成 ─────────────────────────────────────────────────────
-- Tables:    membership_tiers, profiles
-- Functions: handle_new_user()          → auto-create profile on signup
--            award_points_on_confirmation() → auto-award points + tier upgrade
-- Triggers:  on_auth_user_created, reservations_award_points
-- Views:     profile_with_tier
-- RLS:       Enabled on all tables
