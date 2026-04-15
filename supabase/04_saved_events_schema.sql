-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 4
-- Saved Events（收藏演出）
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ⚠️  Requires Part 1 (01_events_schema.sql) to be run first.
-- ⚠️  Requires Part 3 (03_profiles_schema.sql / Supabase Auth) to be run first.
-- ============================================================


-- ── 1. SAVED_EVENTS（收藏表）────────────────────────────────
-- Heart button toggle = INSERT / DELETE on this table

CREATE TABLE saved_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id    UUID        NOT NULL REFERENCES events(id)     ON DELETE CASCADE,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- 防止同一個用戶重複收藏同一場演出
  CONSTRAINT saved_events_unique UNIQUE (user_id, event_id)
);

CREATE INDEX idx_saved_events_user_id  ON saved_events(user_id);
CREATE INDEX idx_saved_events_event_id ON saved_events(event_id);


-- ── 2. ROW LEVEL SECURITY (RLS) ─────────────────────────────

ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;

-- 只有本人可讀自己的收藏
CREATE POLICY "Users read own saved events"
  ON saved_events FOR SELECT
  USING (auth.uid() = user_id);

-- 只有本人可新增收藏
CREATE POLICY "Users insert own saved events"
  ON saved_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 只有本人可刪除自己的收藏（Un-heart）
CREATE POLICY "Users delete own saved events"
  ON saved_events FOR DELETE
  USING (auth.uid() = user_id);


-- ── 3. USEFUL VIEWS ──────────────────────────────────────────

-- 收藏清單（含完整演出資料，供 Profile → Saved Events 頁面使用）
CREATE OR REPLACE VIEW saved_events_detail AS
SELECT
  se.id             AS saved_id,
  se.user_id,
  se.created_at     AS saved_at,
  -- 演出資訊
  e.id              AS event_id,
  e.title,
  e.subtitle,
  e.genre,
  e.status,
  e.date_start,
  e.date_end,
  e.show_1_start,
  e.show_2_start,
  e.price_standard,
  e.price_premium,
  e.price_vip,
  e.hero_image_url,
  e.ticker_tag,
  e.is_highlight,
  e.venue
FROM saved_events se
JOIN events e ON e.id = se.event_id
ORDER BY se.created_at DESC;


-- ── 4. HELPER FUNCTION ───────────────────────────────────────
-- 前端可呼叫此 function 來取得某 event 目前的收藏數（公開資訊）

CREATE OR REPLACE FUNCTION get_event_save_count(p_event_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM saved_events WHERE event_id = p_event_id;
$$ LANGUAGE sql SECURITY DEFINER;


-- ── 5. SAMPLE DATA ───────────────────────────────────────────
-- 收藏資料依賴真實 auth user，這裡不插入範例行
-- 前端透過 INSERT / DELETE toggle 操作即可：
--
--   INSERT INTO saved_events (user_id, event_id) VALUES (auth.uid(), '<event_id>');
--   DELETE FROM saved_events WHERE user_id = auth.uid() AND event_id = '<event_id>';


-- ── 完成 ─────────────────────────────────────────────────────
-- Tables:    saved_events
-- Functions: get_event_save_count(uuid)
-- Views:     saved_events_detail
-- RLS:       Enabled — SELECT / INSERT / DELETE by owner only
