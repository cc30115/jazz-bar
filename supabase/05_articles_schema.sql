-- ============================================================
-- YORU JAZZ BAR — Database Schema: Part 5
-- Editorial / Blog（編輯文章延伸閱讀）
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ⚠️  Requires Part 1 (01_events_schema.sql) to be run first.
-- ============================================================


-- ── 1. ENUM TYPES ───────────────────────────────────────────

CREATE TYPE article_category AS ENUM (
  'editorial',  -- 編輯推薦
  'interview',  -- 藝術家訪談
  'venue',      -- 場館介紹
  'guide'       -- 爵士樂指南
);


-- ── 2. ARTICLES（獨立文章，不绑定演出）──────────────────────
-- 適用於非演出類的內容：場館介紹、音樂評論、爵士樂指南等

CREATE TABLE articles (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 分類 & 基本資訊
  category          article_category NOT NULL DEFAULT 'editorial',
  title             TEXT            NOT NULL,
  subtitle          TEXT,

  -- 內文
  body_text         TEXT,           -- 主要內文（支援段落換行）

  -- 圖片
  hero_image_url    TEXT,           -- 文章主視覺大圖

  -- 作者欄位
  author_name       TEXT,
  author_role       TEXT,           -- e.g. "Music Journalist / Critic"
  author_bio        TEXT,
  author_image_url  TEXT,

  -- 關聯演出（可選）
  related_event_id  UUID            REFERENCES events(id) ON DELETE SET NULL,

  -- 發佈控制
  is_published      BOOLEAN         NOT NULL DEFAULT false,
  published_at      TIMESTAMPTZ,

  -- Metadata
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_articles_category    ON articles(category);
CREATE INDEX idx_articles_published   ON articles(is_published, published_at DESC);
CREATE INDEX idx_articles_event_id    ON articles(related_event_id);


-- ── 3. EDITORIAL_RELATED（延伸閱讀關聯表）───────────────────
-- 手動指定某 event 或 article 的延伸閱讀清單
-- supports: event → event, event → article, article → article

CREATE TABLE editorial_related (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 來源（只能是 event 或 article 之一）
  source_event_id     UUID    REFERENCES events(id)   ON DELETE CASCADE,
  source_article_id   UUID    REFERENCES articles(id) ON DELETE CASCADE,

  -- 目標（只能是 event 或 article 之一）
  related_event_id    UUID    REFERENCES events(id)   ON DELETE CASCADE,
  related_article_id  UUID    REFERENCES articles(id) ON DELETE CASCADE,

  sort_order          INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- 確保 source 只指向一個來源
  CONSTRAINT chk_source_one  CHECK (
    (source_event_id IS NOT NULL)::INT + (source_article_id IS NOT NULL)::INT = 1
  ),
  -- 確保 target 只指向一個目標
  CONSTRAINT chk_target_one  CHECK (
    (related_event_id IS NOT NULL)::INT + (related_article_id IS NOT NULL)::INT = 1
  )
);

CREATE INDEX idx_editorial_related_source_event   ON editorial_related(source_event_id);
CREATE INDEX idx_editorial_related_source_article ON editorial_related(source_article_id);


-- ── 4. ROW LEVEL SECURITY (RLS) ─────────────────────────────

ALTER TABLE articles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_related ENABLE ROW LEVEL SECURITY;

-- 已發佈文章，所有人可讀
CREATE POLICY "Public read published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- 延伸閱讀關聯，所有人可讀
CREATE POLICY "Public read editorial_related"
  ON editorial_related FOR SELECT USING (true);


-- ── 5. USEFUL VIEWS ──────────────────────────────────────────

-- 已發佈文章列表（供 Editorial index 頁）
CREATE OR REPLACE VIEW published_articles AS
SELECT
  id,
  category,
  title,
  subtitle,
  hero_image_url,
  author_name,
  author_role,
  author_image_url,
  related_event_id,
  published_at
FROM articles
WHERE is_published = true
ORDER BY published_at DESC;

-- 延伸閱讀完整資訊（不管來源是 event 還是 article）
CREATE OR REPLACE VIEW editorial_related_detail AS
SELECT
  er.id,
  er.sort_order,
  -- 來源
  er.source_event_id,
  er.source_article_id,
  -- 目標：Event
  e_rel.id          AS rel_event_id,
  e_rel.title       AS rel_event_title,
  e_rel.genre       AS rel_event_genre,
  e_rel.date_start  AS rel_event_date,
  e_rel.hero_image_url AS rel_event_image,
  -- 目標：Article
  a_rel.id          AS rel_article_id,
  a_rel.title       AS rel_article_title,
  a_rel.category    AS rel_article_category,
  a_rel.hero_image_url AS rel_article_image,
  a_rel.published_at   AS rel_article_date
FROM editorial_related er
LEFT JOIN events   e_rel ON e_rel.id = er.related_event_id
LEFT JOIN articles a_rel ON a_rel.id = er.related_article_id
ORDER BY er.sort_order ASC;


-- ── 6. SAMPLE DATA ───────────────────────────────────────────

-- 範例獨立文章
INSERT INTO articles (
  category, title, subtitle,
  body_text,
  hero_image_url,
  author_name, author_role, author_bio, author_image_url,
  is_published, published_at
) VALUES
(
  'interview',
  'The Language of Silence: A Conversation with Sarah Chen',
  'How one pianist learned to listen before she learned to play',
  E'There is a moment before the music begins—a breath held collectively by performers and audience alike—that Sarah Chen describes as "the most important note." This pause, pregnant with anticipation, defines everything that follows.\n\nWe met Chen backstage at YORU on a quiet Tuesday afternoon, three days before her sold-out performance with the Summer Jazz Camp All Stars. Dressed simply in a grey linen shirt, she spoke about her childhood in Shanghai, her conservatory years in Boston, and the specific quality of silence she has been chasing her entire career.\n\n"Western classical training gave me precision," she explained, her hands folded neatly on the table. "But jazz gave me permission—permission to be wrong, to be uncertain, to find something unexpected in the space between the notes."\n\nThat philosophy extends to her collaborative process. Chen does not rehearse in the conventional sense. Instead, she insists on long, unstructured sessions where the group simply listens to recordings together—Monk, Evans, Mehldau—without playing a single note.',
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2000&auto=format&fit=crop',
  'Kenji Takahashi', 'Music Journalist / Critic',
  'Based in Tokyo, Kenji has been covering the international jazz scene for over two decades. His work focuses on the intersection of traditional acoustic jazz and modern improvisational movements.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
  true, now() - INTERVAL '7 days'
),
(
  'venue',
  'Designing for Sound: The Architecture of YORU',
  'How every surface, curve, and material was chosen for the music',
  E'When architect Hiroshi Mori was commissioned to design YORU in 2019, he was given an unusual brief: build a room that disappears.\n\nThe client—YORU''s founder and artistic director Emiko Sato—wanted a space where the audience would be entirely unaware of their physical surroundings. No distracting sightlines, no architectural ego, no surfaces competing with the performers.\n\nThe result is a room that achieves invisibility through radical precision. The walls are clad in hand-formed acoustic panels crafted from reclaimed hinoki cypress, each one individually angled to redirect sound toward the center of the room rather than absorbing it. The ceiling descends in subtle, almost imperceptible waves that eliminate standing waves without drawing the eye upward.',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop',
  'Emiko Watanabe', 'Architecture Correspondent',
  'Emiko writes about the intersection of space, acoustics, and culture across East Asia.',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop',
  true, now() - INTERVAL '14 days'
),
(
  'guide',
  'A Beginner''s Guide to Jazz at YORU',
  'Everything you need to know before your first visit',
  E'Jazz can feel intimidating from the outside. There are decades of records to navigate, an entire vocabulary of styles and sub-genres, and an unwritten etiquette that experienced listeners seem to know instinctively.\n\nBut here is the truth: jazz rewards presence more than knowledge. You do not need to understand the harmonic language of bebop to feel the electricity when a rhythm section locks into a groove. You do not need to know who Miles Davis was to recognise the particular stillness that falls over a room when something extraordinary is happening.\n\nAt YORU, we welcome first-time listeners as warmly as we welcome lifetime devotees. This guide is for those who want a little context before they arrive.',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=2000&auto=format&fit=crop',
  'YORU Editorial Team', 'In-House', NULL, NULL,
  true, now() - INTERVAL '30 days'
);

-- 延伸閱讀：把「Beginner's Guide」連結到 Summer Jazz Camp event
WITH
  src_art AS (SELECT id FROM articles WHERE title LIKE 'A Beginner%' LIMIT 1),
  tgt_evt AS (SELECT id FROM events   WHERE title = 'Summer Jazz Camp All Stars' LIMIT 1)
INSERT INTO editorial_related (source_article_id, related_event_id, sort_order)
SELECT src_art.id, tgt_evt.id, 0
FROM src_art, tgt_evt;

-- 延伸閱讀：把 Summer Jazz Camp event 連結到 Sarah Chen interview
WITH
  src_evt AS (SELECT id FROM events   WHERE title = 'Summer Jazz Camp All Stars' LIMIT 1),
  tgt_art AS (SELECT id FROM articles WHERE title LIKE 'The Language of Silence%' LIMIT 1)
INSERT INTO editorial_related (source_event_id, related_article_id, sort_order)
SELECT src_evt.id, tgt_art.id, 0
FROM src_evt, tgt_art;


-- ── 完成 ─────────────────────────────────────────────────────
-- Tables:    articles, editorial_related
-- Views:     published_articles, editorial_related_detail
-- RLS:       Enabled — published articles public; writes via service_role only
