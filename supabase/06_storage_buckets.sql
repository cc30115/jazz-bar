-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 6
-- Storage Buckets（圖片上傳）
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Creates Storage buckets + RLS policies via SQL
-- ============================================================


-- ── 1. CREATE STORAGE BUCKETS ───────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
(
  'event-heroes',
  'event-heroes',
  true,                          -- 公開讀取
  5242880,                       -- 5MB limit
  ARRAY['image/jpeg','image/png','image/webp']
),
(
  'event-gallery',
  'event-gallery',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
),
(
  'event-tickers',
  'event-tickers',
  true,
  2097152,                       -- 2MB limit（小圖）
  ARRAY['image/jpeg','image/png','image/webp']
),
(
  'artist-photos',
  'artist-photos',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
),
(
  'author-avatars',
  'author-avatars',
  true,
  2097152,
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;


-- ── 2. STORAGE RLS POLICIES ─────────────────────────────────
-- All buckets: public read / service_role write only

-- event-heroes
CREATE POLICY "Public read event-heroes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-heroes');

CREATE POLICY "Service role upload event-heroes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-heroes' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete event-heroes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'event-heroes' AND auth.role() = 'service_role');

-- event-gallery
CREATE POLICY "Public read event-gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-gallery');

CREATE POLICY "Service role upload event-gallery"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-gallery' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete event-gallery"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'event-gallery' AND auth.role() = 'service_role');

-- event-tickers
CREATE POLICY "Public read event-tickers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-tickers');

CREATE POLICY "Service role upload event-tickers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-tickers' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete event-tickers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'event-tickers' AND auth.role() = 'service_role');

-- artist-photos
CREATE POLICY "Public read artist-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artist-photos');

CREATE POLICY "Service role upload artist-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'artist-photos' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete artist-photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'artist-photos' AND auth.role() = 'service_role');

-- author-avatars
CREATE POLICY "Public read author-avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'author-avatars');

CREATE POLICY "Service role upload author-avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'author-avatars' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete author-avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'author-avatars' AND auth.role() = 'service_role');


-- ── 完成 ─────────────────────────────────────────────────────
-- Buckets:   event-heroes, event-gallery, event-tickers,
--            artist-photos, author-avatars
-- Access:    Public read / service_role write & delete
--
-- Public URL pattern:
--   https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<filename>
