# YORU Jazz Bar — Future Database Tables Plan
# 後續資料庫規劃分析

---

## ✅ Part 1 DONE — Events & Monthly Schedule
已完成：`events`, `event_gallery`, `event_lineup`, `event_qa`
Views：`monthly_schedule`, `ticker_events`

---

## ✅ Part 2 DONE — Reservations / Bookings（預約系統）
**功能對應：** Reservation section → Checkout page

### Tables needed:

**`reservations`** 主預約表
- id, user_id (FK → auth.users), event_id (FK → events)
- show_slot: ENUM('first', 'second')  — 1st / 2nd show
- seating_area: ENUM('counter','arena','box_center','side_sofa')
- guest_count: INTEGER
- total_price: INTEGER
- status: ENUM('pending','confirmed','cancelled','no_show')
- special_requests: TEXT
- booking_ref: TEXT UNIQUE  — 確認碼 e.g. "TKT-8921"
- confirmed_at, created_at

**`reservation_guests`** 訂位者資料
- id, reservation_id
- first_name, last_name, email, phone
- is_primary: BOOLEAN  — 主訂位人

**`seating_areas`** 座位區靜態設定表（可後台管理）
- id, area_key, name_en, name_ja
- description, price_per_person
- is_shared: BOOLEAN
- fixed_group_size: INTEGER (null = 自定人數)
- is_available: BOOLEAN
- svg_element_id  — 對應 SVG 地圖的 group id

### Why this design:
- 把座位設定從 hardcode 移至 DB，可後台動態調整
- guest_count 支援 Arena（可變人數）和 Box Center（固定 4 人）
- booking_ref 做 QR Code 的 payload

---

## ✅ Part 3 DONE — User Profiles & Membership（會員系統）
**功能對應：** Profile page (My Tickets, Membership, Settings)

### Tables needed:

**`profiles`** 擴充 Supabase auth.users
- id = auth.users.id (UUID, PK)
- display_name, phone
- member_since: DATE
- tier: ENUM('bronze','silver','gold','platinum')  — 對應 "Gold Patron"
- reward_points: INTEGER DEFAULT 0
- avatar_url: TEXT
- email_prefs_newsletter: BOOLEAN DEFAULT true
- email_prefs_events: BOOLEAN DEFAULT false

**`membership_tiers`** 會員等級靜態設定
- id, tier_key, label_en (e.g. "Gold Patron")
- min_points: INTEGER  — 升級門檻
- perks: JSONB  — 福利列表（Array of strings）
- priority_hours_early: INTEGER  — 提前幾小時可訂位

### Reward points logic:
- 每次成功 reservation → 累積 points（可設計為 trigger）
- Tier 升降由 points 區間決定

---

## ✅ Part 4 DONE — Saved Events（收藏演出）
**功能對應：** Profile → Saved Events + Heart button on cards

### Tables needed:

**`saved_events`**
- id, user_id (FK → auth.users), event_id (FK → events)
- created_at
- UNIQUE(user_id, event_id)  — 防重複收藏

### Notes:
- Heart button 的 toggle 就是 INSERT / DELETE 此表
- 用 Supabase realtime 可做即時同步

---

## ✅ Part 5 DONE — Editorial / Blog（編輯文章延伸閱讀）
**功能對應：** Editorial page → Related Content section

### 目前設計：
Related Content 是 Editorial page 底部的「延伸閱讀」。
目前這個功能由 events 表本身的 editorial 欄位支撐，
但如果未來要支援「非演出的文章」（例如：場館介紹、音樂評論），
可新增：

**`articles`**（獨立文章，不綁演出）
- id, title, subtitle, category: ENUM('editorial','interview','venue','guide')
- body_text, hero_image_url
- author_name, author_role, author_bio, author_image_url
- related_event_id (FK → events, nullable)
- published_at, created_at

**`editorial_related`**（手動指定某 event 的延伸閱讀）
- id, event_id (source)
- related_event_id (FK → events, nullable)
- related_article_id (FK → articles, nullable)
- sort_order

---

## ✅ Part 6 DONE — Storage（圖片上傳）
**功能對應：** 後台管理圖片

Supabase Storage bucket 規劃：
- `event-heroes/`      — 演出主視覺大圖
- `event-gallery/`     — Gallery 輪播圖
- `event-tickers/`     — 跑馬燈小圖
- `artist-photos/`     — 表演者頭像
- `author-avatars/`    — 文章作者頭像

---

## 執行順序建議

| 優先 | Part | 原因 |
|------|------|------|
| ✅ Done | Part 1 Events | 所有頁面的核心資料 |
| ✅ Done | Part 2 Reservations | Checkout flow 是轉換核心 |
| ✅ Done | Part 3 Profiles | 需要 Supabase Auth 先設定 |
| ✅ Done | Part 4 Saved Events | 依賴 Part 3 |
| ✅ Done | Part 5 Articles | 擴充內容，非關鍵路徑 |
| ✅ Done | Part 6 Storage | 搭配後台管理界面一起做 |
