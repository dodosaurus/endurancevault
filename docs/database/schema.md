# Database Schema Documentation

## Overview
PostgreSQL database hosted on Supabase with Prisma ORM for type-safe database operations.

## Schema Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    users    │    │ activities  │    │user_cards   │
│             │◄───┤             │    │             │
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ strava_id   │    │ user_id(FK) │    │ user_id(FK) │
│ currency    │    │ currency_   │    │ card_id(FK) │
│ ...         │    │ earned      │    │ quantity    │
└─────────────┘    │ ...         │    └─────────────┘
       │           └─────────────┘           │
       │                  │                 │
       ▼                  ▼                 ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│transactions │    │booster_opens│    │    cards    │
│             │    │             │    │             │
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ user_id(FK) │    │ user_id(FK) │    │ name        │
│ amount      │    │ cost        │    │ rarity      │
│ ...         │    │ ...         │    │ ...         │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │booster_cards│
                   │             │
                   │ id (PK)     │
                   │booster_open_│
                   │ id (FK)     │
                   │ card_id(FK) │
                   └─────────────┘
```

## Table Definitions

### users
Primary user account information from Strava OAuth.

```sql
CREATE TABLE users (
  id                  SERIAL PRIMARY KEY,
  strava_id           VARCHAR UNIQUE NOT NULL,
  strava_access_token VARCHAR,
  strava_refresh_token VARCHAR,
  token_expires_at    TIMESTAMP,
  
  -- Profile information
  first_name          VARCHAR NOT NULL,
  last_name           VARCHAR NOT NULL,
  profile_picture_url VARCHAR,
  country             VARCHAR,
  state               VARCHAR,
  city                VARCHAR,
  
  -- App-specific data
  currency            INTEGER DEFAULT 500 NOT NULL,
  total_score         INTEGER DEFAULT 0 NOT NULL,
  last_synced_at      TIMESTAMP,
  
  created_at          TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_users_strava_id ON users(strava_id);
CREATE INDEX idx_users_currency ON users(currency);
```

#### Key Fields
- `strava_id`: Unique identifier from Strava (string, not integer)
- `currency`: In-app currency balance, starts at 500 for new users
- `total_score`: Collection progress score based on owned cards
- `last_synced_at`: Timestamp of last activity sync from Strava

---

### cards
Master collection of all available athlete cards.

```sql
CREATE TYPE card_rarity AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

CREATE TABLE cards (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR NOT NULL,
  sport         VARCHAR NOT NULL,
  rarity        card_rarity NOT NULL,
  image_url     VARCHAR,
  description   TEXT,
  nationality   VARCHAR,
  birth_year    INTEGER,
  base_score    INTEGER DEFAULT 1 NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_sport ON cards(sport);
CREATE INDEX idx_cards_name ON cards(name);
```

#### Rarity Distribution
```typescript
const RARITY_DISTRIBUTION = {
  COMMON: 50,      // Regional/national champions
  UNCOMMON: 30,    // Olympic medalists, tournament winners
  RARE: 15,        // Hall of famers, record holders
  EPIC: 4,         // Modern legends (Jordan, Serena, Messi, etc.)
  LEGENDARY: 1     // Ultimate GOAT card
};
```

#### Base Scores
```typescript
const BASE_SCORES = {
  COMMON: 1,
  UNCOMMON: 3, 
  RARE: 8,
  EPIC: 25,
  LEGENDARY: 100
};
```

---

### user_cards
Junction table tracking user's card collection with quantities.

```sql
CREATE TABLE user_cards (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id     INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  quantity    INTEGER DEFAULT 1 NOT NULL,
  obtained_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, card_id)
);

-- Indexes
CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX idx_user_cards_card_id ON user_cards(card_id);
CREATE INDEX idx_user_cards_quantity ON user_cards(quantity);
```

#### Collection Queries
```sql
-- Get user's total collection score
SELECT SUM(c.base_score * uc.quantity) as total_score
FROM user_cards uc
JOIN cards c ON uc.card_id = c.id
WHERE uc.user_id = $1;

-- Get collection completion percentage
SELECT 
  COUNT(DISTINCT uc.card_id) as cards_owned,
  (SELECT COUNT(*) FROM cards) as total_cards,
  (COUNT(DISTINCT uc.card_id) * 100.0 / (SELECT COUNT(*) FROM cards)) as completion_percentage
FROM user_cards uc
WHERE uc.user_id = $1;
```

---

### activities
Cached Strava activities with currency calculations.

```sql
CREATE TYPE activity_type AS ENUM ('RUN', 'RIDE', 'WALK', 'HIKE', 'OTHER');

CREATE TABLE activities (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  strava_activity_id  VARCHAR UNIQUE NOT NULL,
  
  -- Activity data from Strava
  name                VARCHAR NOT NULL,
  activity_type       activity_type NOT NULL,
  distance            FLOAT NOT NULL,     -- meters
  duration            INTEGER NOT NULL,   -- seconds
  start_date          TIMESTAMP NOT NULL,
  
  -- Currency calculation
  currency_earned     INTEGER NOT NULL,
  processed           BOOLEAN DEFAULT FALSE NOT NULL,
  
  created_at          TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_strava_id ON activities(strava_activity_id);
CREATE INDEX idx_activities_start_date ON activities(start_date);
CREATE INDEX idx_activities_processed ON activities(processed);
```

#### Currency Calculation
```sql
-- Example: Calculate currency for a 10km run
-- distance: 10000 meters = 10 km
-- activity_type: 'RUN' (multiplier: 2.0)
-- currency = (10000 / 1000) * 10 * 2.0 = 200 coins
```

---

### transactions
Financial transaction log for all currency operations.

```sql
CREATE TYPE transaction_type AS ENUM (
  'EARNED_ACTIVITY',
  'EARNED_BONUS', 
  'SPENT_BOOSTER',
  'SPENT_REROLL'
);

CREATE TABLE transactions (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            transaction_type NOT NULL,
  amount          INTEGER NOT NULL, -- positive = earned, negative = spent
  description     VARCHAR,
  booster_open_id INTEGER UNIQUE REFERENCES booster_opens(id),
  created_at      TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

#### Transaction Examples
```sql
-- User earns currency from activities
INSERT INTO transactions (user_id, type, amount, description)
VALUES (1, 'EARNED_ACTIVITY', 150, 'Earned from 3 activities');

-- User spends currency on booster pack
INSERT INTO transactions (user_id, type, amount, description, booster_open_id)
VALUES (1, 'SPENT_BOOSTER', -100, 'Opened booster pack', 42);
```

---

### booster_opens
Record of all booster pack purchases and openings.

```sql
CREATE TABLE booster_opens (
  id        SERIAL PRIMARY KEY,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cost      INTEGER DEFAULT 100 NOT NULL,
  opened_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_booster_opens_user_id ON booster_opens(user_id);
CREATE INDEX idx_booster_opens_opened_at ON booster_opens(opened_at);
```

---

### booster_cards
Junction table tracking which cards were obtained from each booster pack.

```sql
CREATE TABLE booster_cards (
  id              SERIAL PRIMARY KEY,
  booster_open_id INTEGER NOT NULL REFERENCES booster_opens(id) ON DELETE CASCADE,
  card_id         INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_booster_cards_booster_open_id ON booster_cards(booster_open_id);
CREATE INDEX idx_booster_cards_card_id ON booster_cards(card_id);
```

#### Booster Pack Queries
```sql
-- Get all cards from a specific booster opening
SELECT c.*, bc.id as booster_card_id
FROM booster_cards bc
JOIN cards c ON bc.card_id = c.id
WHERE bc.booster_open_id = $1;

-- Get booster opening history with cards
SELECT 
  bo.id,
  bo.opened_at,
  bo.cost,
  json_agg(json_build_object(
    'id', c.id,
    'name', c.name,
    'rarity', c.rarity,
    'sport', c.sport
  )) as cards
FROM booster_opens bo
JOIN booster_cards bc ON bo.id = bc.booster_open_id
JOIN cards c ON bc.card_id = c.id
WHERE bo.user_id = $1
GROUP BY bo.id, bo.opened_at, bo.cost
ORDER BY bo.opened_at DESC;
```

## Data Integrity Constraints

### Foreign Key Relationships
- All user-related tables cascade delete when user is removed
- Card references are protected (cannot delete cards that exist in collections)
- Booster openings maintain referential integrity with transactions

### Business Logic Constraints
```sql
-- Ensure users cannot have negative currency
ALTER TABLE users ADD CONSTRAINT check_currency_non_negative 
  CHECK (currency >= 0);

-- Ensure card quantities are positive
ALTER TABLE user_cards ADD CONSTRAINT check_quantity_positive 
  CHECK (quantity > 0);

-- Ensure activity distances are non-negative
ALTER TABLE activities ADD CONSTRAINT check_distance_non_negative 
  CHECK (distance >= 0);
```

### Unique Constraints
- One Strava account per user (`strava_id` unique)
- One activity record per Strava activity (`strava_activity_id` unique)
- One collection entry per user-card combination (`user_id, card_id` unique)
- One transaction per booster opening (`booster_open_id` unique in transactions)

## Performance Considerations

### Indexing Strategy
- Primary keys automatically indexed
- Foreign keys indexed for join performance
- Frequently queried columns indexed (user_id, created_at, etc.)
- Composite indexes for common query patterns

### Query Optimization
```sql
-- Efficient user collection summary
CREATE MATERIALIZED VIEW user_collection_summary AS
SELECT 
  user_id,
  COUNT(DISTINCT card_id) as unique_cards,
  SUM(quantity) as total_cards,
  SUM(c.base_score * uc.quantity) as total_score
FROM user_cards uc
JOIN cards c ON uc.card_id = c.id
GROUP BY user_id;

-- Refresh periodically or after significant changes
REFRESH MATERIALIZED VIEW user_collection_summary;
```

### Scalability Preparations
- Connection pooling via Supabase
- Read replicas for analytics queries
- Partitioning for large transaction tables
- Archive old booster opening data