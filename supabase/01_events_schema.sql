-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 1
-- Events / Performances + Monthly Schedule
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================


-- ── 1. ENUM TYPES ───────────────────────────────────────────

CREATE TYPE event_status AS ENUM (
  'available',    -- 可預約
  'limited',      -- 座位有限
  'few_left',     -- 剩少量座位
  'sold_out'      -- 售完
);

CREATE TYPE ticker_tag AS ENUM (
  'New Performance',
  'Special Guest',
  'Sold Out',
  'Pick Up',
  'Tonight'
);


-- ── 2. EVENTS (核心演出表) ────────────────────────────────────
-- 同時包含 Home 卡片、Monthly Schedule、Editorial subpage 的所有內容

CREATE TABLE events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本資訊
  title               TEXT        NOT NULL,
  subtitle            TEXT,                           -- e.g. "The Next Generation of Jazz Excellence"
  genre               TEXT        NOT NULL,           -- e.g. "Classic Jazz & Bebop"
  status              event_status NOT NULL DEFAULT 'available',

  -- 時間
  date_start          DATE        NOT NULL,
  date_end            DATE,                           -- 多日演出的結束日
  show_1_open         TIME,                           -- 1st Show 開場時間 e.g. 17:00
  show_1_start        TIME,                           -- 1st Show 開演時間 e.g. 18:00
  show_2_open         TIME,                           -- 2nd Show 開場時間 e.g. 19:45
  show_2_start        TIME,                           -- 2nd Show 開演時間 e.g. 20:30

  -- 票價
  price_standard      INTEGER,                        -- 日圓整數, e.g. 8000
  price_premium       INTEGER,
  price_vip           INTEGER,

  -- 月曆 / 排程控制
  is_highlight        BOOLEAN     NOT NULL DEFAULT false,  -- Monthly Schedule 大卡片
  is_featured_tonight BOOLEAN     NOT NULL DEFAULT false,  -- Hero 區塊 "Tonight" 卡片

  -- 圖片
  hero_image_url      TEXT,                           -- 主視覺（大圖）
  ticker_image_url    TEXT,                           -- 跑馬燈小圖 (38×38px)

  -- 跑馬燈
  ticker_tag          ticker_tag,                     -- 跑馬燈標籤文字
  ticker_visible      BOOLEAN     NOT NULL DEFAULT true,

  -- Editorial Subpage ─ 頁頭
  editorial_label     TEXT        DEFAULT 'Pick Up',  -- e.g. "Pick Up", "Tonight"
  published_at        DATE,                           -- 顯示在 editorial 上的日期

  -- Editorial Subpage ─ 引言區
  intro_quote         TEXT,                           -- 大斜體引言文字
  interview_credit    TEXT,                           -- e.g. "Kenji Takahashi"
  cooperation_credit  TEXT,                           -- e.g. "Tokyo Jazz Festival Committee"

  -- Editorial Subpage ─ 內文
  section_1_heading   TEXT,                           -- e.g. "A New Era Begins"
  section_1_body      TEXT,                           -- 第一段內文（支援換行）
  section_2_body      TEXT,                           -- 第二段內文

  -- Editorial Subpage ─ 作者
  author_name         TEXT,
  author_role         TEXT,                           -- e.g. "Music Journalist / Critic"
  author_bio          TEXT,
  author_image_url    TEXT,

  -- Editorial Subpage ─ 場地資訊
  venue               TEXT        DEFAULT 'YORU Tokyo Ginza',

  -- Metadata
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── 3. EVENT_GALLERY (圖片庫) ──────────────────────────────
-- 每場演出可擁有多張圖片（用於 Editorial 橫向滑動 Gallery）

CREATE TABLE event_gallery (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID    NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url   TEXT    NOT NULL,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,             -- 排列順序（由小到大）
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_event_id ON event_gallery(event_id);
CREATE INDEX idx_gallery_sort    ON event_gallery(event_id, sort_order);


-- ── 4. EVENT_LINEUP (表演者陣容) ───────────────────────────
-- 每場演出可列出多位表演者（顯示於 Editorial → Event Information）

CREATE TABLE event_lineup (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID    NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  instrument  TEXT    NOT NULL,                       -- e.g. "Piano", "Bass", "Drums"
  artist_name TEXT    NOT NULL,                       -- e.g. "Sarah Chen"
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lineup_event_id ON event_lineup(event_id);


-- ── 5. EVENT_QA (問答區塊) ────────────────────────────────
-- Editorial Subpage 中的 "In Conversation" Q&A 段落

CREATE TABLE event_qa (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID    NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  question    TEXT    NOT NULL,
  answer      TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qa_event_id ON event_qa(event_id);


-- ── 6. ROW LEVEL SECURITY (RLS) ─────────────────────────────
-- Public 可讀取已上架演出；寫入只允許 service_role（後台）

ALTER TABLE events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_lineup  ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_qa      ENABLE ROW LEVEL SECURITY;

-- 所有人可讀
CREATE POLICY "Public read events"
  ON events FOR SELECT USING (true);

CREATE POLICY "Public read gallery"
  ON event_gallery FOR SELECT USING (true);

CREATE POLICY "Public read lineup"
  ON event_lineup FOR SELECT USING (true);

CREATE POLICY "Public read qa"
  ON event_qa FOR SELECT USING (true);


-- ── 7. USEFUL VIEWS ──────────────────────────────────────────

-- Monthly Schedule View：highlight 優先，其次最接近今日
CREATE OR REPLACE VIEW monthly_schedule AS
SELECT
  e.*,
  CASE
    WHEN e.status = 'sold_out' THEN 'Sold Out'
    WHEN e.status = 'limited'  THEN 'Limited Seats'
    WHEN e.status = 'few_left' THEN 'Few Left'
    ELSE 'Available'
  END AS status_label
FROM events e
WHERE e.date_start >= date_trunc('month', CURRENT_DATE)
  AND e.date_start <  date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
ORDER BY
  e.is_highlight DESC,              -- Highlight 排最前
  ABS(e.date_start - CURRENT_DATE) ASC;  -- 其次最接近今日

-- Ticker View：只顯示 ticker_visible = true 的演出
CREATE OR REPLACE VIEW ticker_events AS
SELECT
  id,
  title,
  ticker_tag,
  ticker_image_url,
  date_start
FROM events
WHERE ticker_visible = true
ORDER BY date_start ASC;


-- ── 8. SAMPLE DATA ───────────────────────────────────────────
-- 匯入與程式碼現有資料一致的範例資料

INSERT INTO events (
  title, subtitle, genre, status,
  date_start, date_end,
  show_1_open, show_1_start, show_2_open, show_2_start,
  price_standard, price_premium, price_vip,
  is_highlight, is_featured_tonight,
  hero_image_url, ticker_image_url,
  ticker_tag, ticker_visible,
  editorial_label, published_at,
  intro_quote, interview_credit, cooperation_credit,
  section_1_heading, section_1_body, section_2_body,
  author_name, author_role, author_bio, author_image_url,
  venue
) VALUES
(
  'The Blue Notes Quartet',
  NULL,
  'Classic Jazz & Bebop',
  'limited',
  '2026-10-24', NULL,
  '17:00', '18:00', '19:45', '20:30',
  8000, 12000, 25000,
  true, false,
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=150&auto=format&fit=crop',
  'New Performance', true,
  'Pick Up', '2026-10-01',
  '"Jazz is not just music, it''s a way of life, a way of being, a way of thinking." This autumn, we welcome one of Tokyo''s most celebrated ensembles back to the YORU stage.',
  'Kenji Takahashi', 'Tokyo Jazz Festival Committee',
  'The Masters Return',
  'The Blue Notes Quartet has long been regarded as the gold standard of Tokyo''s acoustic jazz scene. Known for their impeccable interplay and deep reverence for the bebop tradition, their performances at YORU are perennial sell-outs.',
  'What sets this ensemble apart is not merely their technical precision—which is formidable—but their ability to communicate profound emotions through a shared musical language developed over fifteen years of collaboration.',
  'Kenji Takahashi', 'Music Journalist / Critic',
  'Based in Tokyo, Kenji has been covering the international jazz scene for over two decades. His work focuses on the intersection of traditional acoustic jazz and modern improvisational movements.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
  'YORU Tokyo Ginza'
),
(
  'Yumi & The Velvet',
  NULL,
  'Bossa Nova & Vocals',
  'sold_out',
  '2026-10-26', NULL,
  '17:00', '18:00', '19:45', '20:30',
  6500, 10000, NULL,
  false, false,
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=150&auto=format&fit=crop',
  'Sold Out', true,
  'Pick Up', '2026-10-05',
  NULL, NULL, NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL,
  'YORU Tokyo Ginza'
),
(
  'Midnight Saxophone',
  NULL,
  'Smooth Jazz & Soul',
  'available',
  '2026-10-31', NULL,
  '17:00', '18:00', '19:45', '20:30',
  5500, 9000, NULL,
  false, false,
  'https://images.unsplash.com/photo-1573220464670-658b4b7cde6c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=150&auto=format&fit=crop',
  'New Performance', true,
  'Pick Up', '2026-10-10',
  NULL, NULL, NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL,
  'YORU Tokyo Ginza'
),
(
  'Chikuzen Satō × Lagheads',
  '"Answer The Future"',
  'Contemporary & Fusion',
  'available',
  '2026-11-03', NULL,
  '17:00', '18:00', '19:45', '20:30',
  8000, 12000, 25000,
  false, true,
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=150&auto=format&fit=crop',
  'Special Guest', true,
  'Tonight', '2026-11-03',
  NULL, NULL, NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL,
  'YORU Tokyo Ginza'
),
(
  'Dee Dee Bridgewater & Bill Charlap',
  NULL,
  'Vocal Jazz',
  'available',
  '2026-05-30', '2026-06-01',
  '17:00', '18:00', '19:45', '20:30',
  8000, 12000, 25000,
  false, false,
  'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=150&auto=format&fit=crop',
  'Pick Up', true,
  'Pick Up', '2026-04-15',
  '"Nominated for a Grammy Award for Best Jazz Vocal, this is a sublime world portrayed by a top vocalist and a master pianist."',
  NULL, NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL,
  'YORU Tokyo Ginza'
),
(
  'Summer Jazz Camp All Stars',
  'The Next Generation of Jazz Excellence',
  'Contemporary Jazz',
  'available',
  '2026-06-15', '2026-06-16',
  '17:00', '18:00', '19:45', '20:30',
  8000, 12000, 25000,
  false, false,
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=150&auto=format&fit=crop',
  'New Performance', true,
  'Pick Up', '2026-05-15',
  '"Jazz is not just music, it''s a way of life, a way of being, a way of thinking." This summer, we bring together the most promising young talents from across the globe to redefine the boundaries of contemporary jazz.',
  'Kenji Takahashi', 'Tokyo Jazz Festival Committee',
  'A New Era Begins',
  'The Summer Jazz Camp has always been a crucible for raw talent, but this year''s ensemble brings something entirely unprecedented to the stage. Selected from over 500 applicants worldwide, these five musicians represent the absolute vanguard of their respective instruments.',
  'What makes this group special isn''t just their technical proficiency—which is staggering—but their deep understanding of the jazz tradition combined with a fearless approach to modern harmony and rhythm.',
  'Kenji Takahashi', 'Music Journalist / Critic',
  'Based in Tokyo, Kenji has been covering the international jazz scene for over two decades. His work focuses on the intersection of traditional acoustic jazz and modern improvisational movements.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
  'YORU Tokyo Ginza'
);


-- Gallery images for "Summer Jazz Camp All Stars"
WITH ev AS (SELECT id FROM events WHERE title = 'Summer Jazz Camp All Stars' LIMIT 1)
INSERT INTO event_gallery (event_id, image_url, sort_order) VALUES
  ((SELECT id FROM ev), 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop', 0),
  ((SELECT id FROM ev), 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=800&auto=format&fit=crop', 1),
  ((SELECT id FROM ev), 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=800&auto=format&fit=crop', 2),
  ((SELECT id FROM ev), 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop', 3),
  ((SELECT id FROM ev), 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', 4);

-- Lineup for "Summer Jazz Camp All Stars"
WITH ev AS (SELECT id FROM events WHERE title = 'Summer Jazz Camp All Stars' LIMIT 1)
INSERT INTO event_lineup (event_id, instrument, artist_name, sort_order) VALUES
  ((SELECT id FROM ev), 'Piano',  'Sarah Chen',     0),
  ((SELECT id FROM ev), 'Bass',   'Marcus Johnson', 1),
  ((SELECT id FROM ev), 'Drums',  'Yuki Tanaka',    2);

-- Q&A for "Summer Jazz Camp All Stars"
WITH ev AS (SELECT id FROM events WHERE title = 'Summer Jazz Camp All Stars' LIMIT 1)
INSERT INTO event_qa (event_id, question, answer, sort_order) VALUES
  ((SELECT id FROM ev),
   'How did this specific group of musicians come together?',
   'It was incredibly organic. We met during the first day of the camp''s jam session. There was this immediate unspoken connection. We started playing a standard, but within minutes it morphed into this complex, polyrhythmic exploration. We just looked at each other and knew this was the group.',
   0),
  ((SELECT id FROM ev),
   'What can the audience expect from your performance at YORU?',
   'A journey. We''re honoring the acoustic tradition of the club, but we''re bringing our own compositions that reflect our diverse backgrounds—from classical Indian music to modern electronic influences, all filtered through the lens of acoustic jazz. It''s going to be intimate, intense, and completely unrepeatable.',
   1);

-- ── 完成 ──────────────────────────────────────────────────────
-- Tables: events, event_gallery, event_lineup, event_qa
-- Views:  monthly_schedule, ticker_events
