-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 2
-- Reservations / Bookings（預約系統）
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ⚠️  Requires Part 1 (01_events_schema.sql) to be run first.
-- ============================================================


-- ── 1. ENUM TYPES ───────────────────────────────────────────

CREATE TYPE show_slot AS ENUM (
  'first',   -- 1st Show
  'second'   -- 2nd Show
);

CREATE TYPE seating_area_key AS ENUM (
  'counter',      -- Counter Seats（吧台）
  'arena',        -- Arena Seats（可變人數）
  'box_center',   -- Box Center（固定 4 人包廂）
  'side_sofa'     -- Side Sofa（沙發區）
);

CREATE TYPE reservation_status AS ENUM (
  'pending',      -- 等待確認
  'confirmed',    -- 已確認
  'cancelled',    -- 已取消
  'no_show'       -- 未入場
);


-- ── 2. SEATING_AREAS（座位區靜態設定）────────────────────────
-- 後台可管理的座位設定，避免 hardcode 在前端

CREATE TABLE seating_areas (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  area_key          seating_area_key  NOT NULL UNIQUE,  -- 對應 ENUM key
  name_en           TEXT          NOT NULL,              -- e.g. "Counter Seats"
  name_ja           TEXT,                                -- e.g. "カウンター席"

  description       TEXT,                                -- 簡短說明
  price_per_person  INTEGER       NOT NULL,              -- 每人金額（JPY）

  is_shared         BOOLEAN       NOT NULL DEFAULT false, -- 是否為共用座位
  fixed_group_size  INTEGER,                             -- NULL = 自訂人數, 4 = 固定 4 人
  min_guests        INTEGER       NOT NULL DEFAULT 1,    -- 最少人數
  max_guests        INTEGER,                             -- 最多人數（NULL = 無上限）

  is_available      BOOLEAN       NOT NULL DEFAULT true, -- 是否開放預約

  svg_element_id    TEXT,                                -- 對應 SVG 座位地圖的 group id

  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TRIGGER seating_areas_updated_at
  BEFORE UPDATE ON seating_areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── 3. RESERVATIONS（主預約表）──────────────────────────────

CREATE TABLE reservations (
  id                UUID              PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 關聯
  user_id           UUID              REFERENCES auth.users(id) ON DELETE SET NULL,
  event_id          UUID              NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
  seating_area_id   UUID              NOT NULL REFERENCES seating_areas(id),

  -- 場次
  show_slot         show_slot         NOT NULL,  -- 'first' 或 'second'

  -- 人數 & 金額
  guest_count       INTEGER           NOT NULL CHECK (guest_count >= 1),
  total_price       INTEGER           NOT NULL CHECK (total_price >= 0),  -- JPY

  -- 狀態
  status            reservation_status NOT NULL DEFAULT 'pending',

  -- 特殊需求 & 確認碼
  special_requests  TEXT,
  booking_ref       TEXT              UNIQUE NOT NULL,  -- e.g. "TKT-8921"

  -- 時間戳記
  confirmed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ       NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ       NOT NULL DEFAULT now()
);

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for common queries
CREATE INDEX idx_reservations_event_id   ON reservations(event_id);
CREATE INDEX idx_reservations_user_id    ON reservations(user_id);
CREATE INDEX idx_reservations_status     ON reservations(status);
CREATE INDEX idx_reservations_booking_ref ON reservations(booking_ref);


-- ── 4. RESERVATION_GUESTS（訂位者資料）──────────────────────
-- 分離訂位者與 auth user，方便支援訪客預約

CREATE TABLE reservation_guests (
  id              UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  UUID      NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,

  first_name      TEXT      NOT NULL,
  last_name       TEXT      NOT NULL,
  email           TEXT      NOT NULL,
  phone           TEXT,

  is_primary      BOOLEAN   NOT NULL DEFAULT false,  -- 主訂位人

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_guests_reservation_id ON reservation_guests(reservation_id);


-- ── 5. BOOKING REF GENERATOR ────────────────────────────────
-- 自動生成確認碼 e.g. "TKT-8921"（4 位隨機數字）

CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    ref := 'TKT-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    SELECT EXISTS (SELECT 1 FROM reservations WHERE booking_ref = ref) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto-set booking_ref if not provided
CREATE OR REPLACE FUNCTION set_booking_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_ref IS NULL OR NEW.booking_ref = '' THEN
    NEW.booking_ref := generate_booking_ref();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_set_booking_ref
  BEFORE INSERT ON reservations
  FOR EACH ROW EXECUTE FUNCTION set_booking_ref();


-- ── 6. ROW LEVEL SECURITY (RLS) ─────────────────────────────

ALTER TABLE seating_areas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_guests   ENABLE ROW LEVEL SECURITY;

-- Seating Areas：所有人可讀（公開座位資訊）
CREATE POLICY "Public read seating_areas"
  ON seating_areas FOR SELECT USING (true);

-- Reservations：只有本人可讀自己的訂位；後台 service_role 不受限
CREATE POLICY "Users read own reservations"
  ON reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own reservations"
  ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users update own pending reservations"
  ON reservations FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Reservation Guests：跟著 reservation 走
CREATE POLICY "Users read own reservation guests"
  ON reservation_guests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reservations r
      WHERE r.id = reservation_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own reservation guests"
  ON reservation_guests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reservations r
      WHERE r.id = reservation_id AND (r.user_id = auth.uid() OR r.user_id IS NULL)
    )
  );


-- ── 7. USEFUL VIEWS ──────────────────────────────────────────

-- 完整訂位資訊（含演出 & 座位）
CREATE OR REPLACE VIEW reservations_detail AS
SELECT
  r.id,
  r.booking_ref,
  r.status,
  r.show_slot,
  r.guest_count,
  r.total_price,
  r.special_requests,
  r.confirmed_at,
  r.created_at,
  -- 演出
  e.title           AS event_title,
  e.date_start      AS event_date,
  e.show_1_start,
  e.show_2_start,
  e.hero_image_url  AS event_image,
  -- 座位
  sa.area_key,
  sa.name_en        AS seating_name,
  sa.price_per_person,
  -- 訂位者（主訂位人）
  g.first_name,
  g.last_name,
  g.email,
  g.phone
FROM reservations r
JOIN events e          ON e.id  = r.event_id
JOIN seating_areas sa  ON sa.id = r.seating_area_id
LEFT JOIN reservation_guests g
  ON g.reservation_id = r.id AND g.is_primary = true;


-- ── 8. SAMPLE DATA ───────────────────────────────────────────

-- 座位區設定
INSERT INTO seating_areas (area_key, name_en, name_ja, description, price_per_person, is_shared, fixed_group_size, min_guests, max_guests, is_available, svg_element_id) VALUES
(
  'counter',
  'Counter Seats',
  'カウンター席',
  'Intimate bar-side seating with a direct view of the performers. Ideal for solo guests or couples.',
  8000,
  true,    -- 共用吧台
  NULL,    -- 自定人數
  1, 2,
  true,
  'svg-counter'
),
(
  'arena',
  'Arena Seats',
  'アリーナ席',
  'Floor-level seating closest to the stage. Flexible group sizes with an immersive live experience.',
  10000,
  false,
  NULL,    -- 自定人數
  2, 8,
  true,
  'svg-arena'
),
(
  'box_center',
  'Box Center',
  'ボックスシート（センター）',
  'Private center-stage booth seating for groups of four. Premium sight lines and dedicated table service.',
  12000,
  false,
  4,       -- 固定 4 人
  4, 4,
  true,
  'svg-box-center'
),
(
  'side_sofa',
  'Side Sofa',
  'サイドソファ',
  'Relaxed sofa seating along the side walls. Semi-private with a warm, lounge atmosphere.',
  9000,
  false,
  NULL,
  2, 6,
  true,
  'svg-side-sofa'
);


-- 範例預約（需要真實 auth user UUID，這裡用 NULL 代替 user_id 做示範）
-- 實際運行時請將 NULL 替換為真實的 auth.users.id
INSERT INTO reservations (
  user_id, event_id, seating_area_id,
  show_slot, guest_count, total_price,
  status, special_requests, booking_ref
)
SELECT
  NULL,                                          -- user_id（測試用）
  e.id,                                          -- event_id
  sa.id,                                         -- seating_area_id
  'first',                                       -- show_slot
  2,                                             -- guest_count
  20000,                                         -- total_price (2 × 10,000)
  'confirmed',
  'Celebrating anniversary. Champagne preferred.',
  'TKT-0001'
FROM events e, seating_areas sa
WHERE e.title = 'Summer Jazz Camp All Stars'
  AND sa.area_key = 'arena'
LIMIT 1;

-- 對應主訂位客人資料
INSERT INTO reservation_guests (reservation_id, first_name, last_name, email, phone, is_primary)
SELECT
  r.id,
  'Yuki',
  'Nakamura',
  'yuki.nakamura@example.com',
  '+81-90-1234-5678',
  true
FROM reservations r
WHERE r.booking_ref = 'TKT-0001';


-- ── 完成 ─────────────────────────────────────────────────────
-- Tables:    seating_areas, reservations, reservation_guests
-- Functions: generate_booking_ref(), set_booking_ref()
-- Views:     reservations_detail
-- RLS:       Enabled on all tables
