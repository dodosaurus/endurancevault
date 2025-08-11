# Card Collection System

## Overview
The card collection features 100 legendary endurance athletes specializing in cycling, road running (marathons, track), and trail/ultra running, organized into 5 rarity tiers. Users collect cards by opening booster packs purchased with in-app currency.

## Card Collection Structure

### Total Collection: 100 Cards

#### Rarity Distribution
```typescript
enum CardRarity {
  COMMON = 49 cards,      // Strong endurance athletes across disciplines
  UNCOMMON = 31 cards,    // Notable champions and major race winners
  RARE = 15 cards,        // Hall of famers, record holders, legends
  EPIC = 4 cards,         // Endurance icons (Merckx, Jornet, Zátopek, etc.)
  LEGENDARY = 1 card      // Ultimate endurance GOAT (Eliud Kipchoge)
}
```

#### Visual Rarity Indicators
```typescript
const rarityColors = {
  COMMON: '#6B7280',      // Gray
  UNCOMMON: '#10B981',    // Green
  RARE: '#3B82F6',        // Blue
  EPIC: '#8B5CF6',        // Purple
  LEGENDARY: '#F59E0B'    // Orange/Gold
}
```

## Card Data Structure

### Database Schema
```sql
cards:
  id: serial primary key
  name: varchar -- Athlete name
  sport: varchar -- Cycling, Marathon, Distance Running, Trail/Ultra Running
  rarity: enum (COMMON, UNCOMMON, RARE, EPIC, LEGENDARY)
  image_url: varchar -- Card image URL
  description: text -- Notable achievements
  nationality: varchar -- Country
  birth_year: integer -- Birth year
  base_score: integer -- Collection points value
  created_at: timestamp
```

### Card Attributes
```typescript
interface Card {
  id: number;
  name: string;           // "Eliud Kipchoge"
  sport: string;          // "Marathon"
  rarity: CardRarity;     // LEGENDARY
  imageUrl?: string;      // Card artwork
  description?: string;   // "Marathon GOAT - 2:01:09 WR, 2x Olympic champion"
  nationality?: string;   // "Kenya"
  birthYear?: number;     // 1984
  baseScore: number;      // Points for collection score
}
```

## Collection Scoring System

### Base Score by Rarity
```typescript
const baseScores = {
  COMMON: 1,
  UNCOMMON: 3,
  RARE: 8,
  EPIC: 25,
  LEGENDARY: 100
};
```

### Total Score Calculation
```typescript
// User's total collection score
totalScore = sum of (card.baseScore × quantity_owned)

// Example:
// 10 Common cards (10 × 1) = 10 points
// 5 Uncommon cards (5 × 3) = 15 points  
// 2 Rare cards (2 × 8) = 16 points
// 1 Epic card (1 × 25) = 25 points
// Total: 66 points
```

## User Card Collection

### Database Schema
```sql
user_cards:
  id: serial primary key
  user_id: integer references users(id)
  card_id: integer references cards(id)
  quantity: integer default 1
  obtained_at: timestamp default now()
  
  unique(user_id, card_id)
```

### Collection Management
```typescript
// Add card to user collection
const addCardToCollection = async (userId: number, cardId: number) => {
  await UserCard.upsert({
    where: { userId_cardId: { userId, cardId } },
    update: { quantity: { increment: 1 } },
    create: { userId, cardId, quantity: 1 }
  });
};

// Get user's collection progress
const getCollectionProgress = async (userId: number) => {
  const userCards = await UserCard.findMany({
    where: { userId },
    include: { card: true }
  });
  
  const totalCards = userCards.length;
  const totalScore = userCards.reduce((sum, uc) => 
    sum + (uc.card.baseScore * uc.quantity), 0
  );
  
  return {
    cardsOwned: totalCards,
    totalCards: 100,
    completionPercentage: (totalCards / 100) * 100,
    totalScore
  };
};
```

## Sample Endurance Athletes by Rarity

### Legendary (1 card)
```typescript
{
  name: "Eliud Kipchoge",
  sport: "Marathon", 
  description: "Marathon GOAT - 2:01:09 WR, 2x Olympic champion, first sub-2 hour",
  nationality: "Kenya",
  rarity: "LEGENDARY"
}
```

### Epic (4 cards)
```typescript
[
  { name: "Eddy Merckx", sport: "Cycling", nationality: "Belgium" },
  { name: "Kilian Jornet", sport: "Trail/Ultra Running", nationality: "Spain" },
  { name: "Emil Zátopek", sport: "Distance Running", nationality: "Czechoslovakia" },
  { name: "Haile Gebrselassie", sport: "Marathon", nationality: "Ethiopia" }
]
```

### Rare (15 cards)
Examples: Bernard Hinault (cycling), Paula Radcliffe (marathon), Ann Trason (ultra), etc.

### Uncommon (31 cards)  
Examples: Tadej Pogačar (cycling), Mo Farah (distance), François D'Haene (ultra trail)

### Common (49 cards)
Examples: Jonas Vingegaard (cycling), Ryan Hall (marathon), Jim Walmsley (ultra trail)

## Collection UI Features

### Collection Grid
```typescript
// Display cards in grid format
const CollectionGrid = () => {
  return (
    <FlatGrid
      data={userCards}
      numColumns={3}
      renderItem={({ item }) => (
        <CardItem 
          card={item.card}
          quantity={item.quantity}
          rarity={item.card.rarity}
        />
      )}
    />
  );
};
```

### Card Details Modal
```typescript
// Detailed card view
const CardModal = ({ card, quantity }) => {
  return (
    <Modal>
      <Image source={{ uri: card.imageUrl }} />
      <Text style={rarityStyles[card.rarity]}>{card.name}</Text>
      <Text>{card.sport} • {card.nationality}</Text>
      <Text>Owned: {quantity}</Text>
      <Text>{card.description}</Text>
    </Modal>
  );
};
```

### Progress Indicators
```typescript
// Collection completion stats
const ProgressStats = ({ progress }) => {
  return (
    <View>
      <Text>{progress.cardsOwned}/100 cards collected</Text>
      <ProgressBar 
        progress={progress.completionPercentage / 100}
        color="#FF6B35" 
      />
      <Text>Total Score: {progress.totalScore}</Text>
    </View>
  );
};
```

## Search and Filtering

### Filter Options
- **By Rarity**: Show only specific rarity cards
- **By Sport**: Filter by Cycling, Marathon, Distance Running, Trail/Ultra Running
- **By Ownership**: Owned vs. not owned
- **By Nationality**: Filter by country

### Search Implementation
```typescript
const searchCards = (cards: Card[], query: string) => {
  return cards.filter(card => 
    card.name.toLowerCase().includes(query.toLowerCase()) ||
    card.sport.toLowerCase().includes(query.toLowerCase()) ||
    card.nationality?.toLowerCase().includes(query.toLowerCase())
  );
};
```

## Future Features
- **Trading System**: Exchange duplicate cards with friends
- **Achievements**: Unlock rewards for collection milestones
- **Seasonal Cards**: Limited-time athlete cards
- **Card Evolution**: Upgrade cards with duplicates
- **Leaderboards**: Compare collection progress with others