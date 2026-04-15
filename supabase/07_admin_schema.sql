-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 7
-- Admin Roles & RLS Policies
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ⚠️  Requires all previous Parts to be run first.
-- ============================================================

-- ── 1. UPDATE PROFILES ──────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Add an index for fetching admins
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- ── 2. ADMIN RLS POLICIES FOR EVENTS ────────────────────────

-- events
CREATE POLICY "Admins full access to events"
  ON events FOR ALL
  USING ( (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true );

-- event_gallery
CREATE POLICY "Admins full access to event_gallery"
  ON event_gallery FOR ALL
  USING ( (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true );

-- event_lineup
CREATE POLICY "Admins full access to event_lineup"
  ON event_lineup FOR ALL
  USING ( (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true );

-- event_qa
CREATE POLICY "Admins full access to event_qa"
  ON event_qa FOR ALL
  USING ( (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true );

-- ── 3. ADMIN RLS POLICIES FOR ARTICLES ──────────────────────

-- articles
CREATE POLICY "Admins full access to articles"
  ON articles FOR ALL
  USING ( (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true );

-- editorial_related
CREATE POLICY "Admins full access to editorial_related"
  ON editorial_related FOR ALL
  USING ( (SELECT is_admin FROM profiles WHERE profiles.id = auth.uid()) = true );

-- ── 4. HOW TO ELEVATE A USER TO ADMIN ───────────────────────
-- To make a user an admin, run this query replacing the email address:
/*
  UPDATE profiles
  SET is_admin = true
  WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@yourdomain.com');
*/
