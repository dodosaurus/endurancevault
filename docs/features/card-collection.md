# Card Collection System

## Overview
The card collection features 135 World Tour cyclists organized into 5 rarity tiers. Users collect cards by opening booster packs purchased with in-app currency. The collection changes annually with new cyclists.

## Card Collection Structure

### Total Collection: 135 Cards

#### Rarity Distribution
```typescript
enum CardRarity {
  COMMON = 81 cards,      // Professional World Tour riders
  UNCOMMON = 34 cards,    // Stage winners and strong performers
  RARE = 15 cards,        // Monument winners and classics specialists
  EPIC = 4 cards,         // Grand Tour podium finishers and world champions
  LEGENDARY = 1 card      // Current cycling GOAT (Tadej Pogačar)
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
  name: varchar -- Cyclist name
  sport: varchar -- Road Cycling (World Tour)
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
  name: string;           // "Tadej Pogačar"
  sport: string;          // "Road Cycling"
  rarity: CardRarity;     // LEGENDARY
  imageUrl?: string;      // Card artwork
  description?: string;   // "2x Tour de France winner, Monument specialist"
  nationality?: string;   // "Slovenia"
  birthYear?: number;     // 1998
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
    totalCards: 135,
    completionPercentage: (totalCards / 135) * 100,
    totalScore
  };
};
```

## Sample World Tour Cyclists by Rarity

### Legendary (1 card)
```typescript
{
  name: "Tadej Pogačar",
  sport: "Road Cycling", 
  description: "2x Tour de France winner, Monument specialist, cycling phenomenon",
  nationality: "Slovenia",
  rarity: "LEGENDARY"
}
```

### Epic (4 cards)
```typescript
[
  { name: "Jonas Vingegaard", sport: "Road Cycling", nationality: "Denmark" },
  { name: "Primoz Roglic", sport: "Road Cycling", nationality: "Slovenia" },
  { name: "Wout van Aert", sport: "Road Cycling", nationality: "Belgium" },
  { name: "Mathieu van der Poel", sport: "Road Cycling", nationality: "Netherlands" }
]
```

### Rare (15 cards)
Examples: Remco Evenepoel, Julian Alaphilippe, Peter Sagan, Filippo Ganna, etc.

### Uncommon (34 cards)  
Examples: Jai Hindley, Adam Yates, Sepp Kuss, Michael Matthews, etc.

### Common (81 cards)
Examples: Dylan Groenewegen, Caleb Ewan, Stefan Küng, Tiesj Benoot, etc.

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
      <Text>{progress.cardsOwned}/135 cards collected</Text>
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
- **By Team**: Filter by cycling teams or nationality
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

## Annual Collection Updates

### 2025 Migration to World Tour Cyclists
The app was successfully migrated from a multi-sport collection to focus exclusively on World Tour cyclists:

- **Migration Date**: August 2025
- **Data Source**: ProCyclingStats.com rankings
- **Collection Size**: 135 World Tour cyclists
- **Rarity Distribution**: Adjusted for cycling-specific achievements
- **Database Migration**: Complete replacement of card collection

### Future Collection Plans
- **Annual Updates**: New cyclist collections each season
- **Ranking-Based Selection**: Top 135 riders from current World Tour rankings
- **Achievement Research**: Detailed descriptions for each cyclist
- **Rarity Rebalancing**: Adjust distribution based on current performance

## Future Features
- **Trading System**: Exchange duplicate cards with friends
- **Achievements**: Unlock rewards for collection milestones
- **Annual Collection Events**: Special packs for new season launches
- **Card Evolution**: Upgrade cards with duplicates
- **Leaderboards**: Compare collection progress with others