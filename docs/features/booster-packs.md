# Booster Pack System

## Overview
Booster packs are the primary method for users to acquire new cards in their collection. Each pack contains 4 cards with guaranteed rarities and probabilistic chances for higher-tier cards.

## Pack Configuration

### Standard Booster Pack
```typescript
const BOOSTER_CONFIG = {
  cost: 100,              // Currency cost per pack
  cardCount: 4,           // Cards per pack
  guaranteedCommon: 3,    // Always get 3 common cards
  bonusCard: 1            // 1 card with rarity chances
};
```

### Rarity Probabilities
```typescript
const RARITY_CHANCES = {
  COMMON: 70.0,      // 70% chance
  UNCOMMON: 20.0,    // 20% chance  
  RARE: 7.0,         // 7% chance
  EPIC: 2.5,         // 2.5% chance
  LEGENDARY: 0.5     // 0.5% chance
};
```

## Pack Opening Mechanics

### Card Selection Algorithm
```typescript
const generateBoosterPack = async (): Promise<Card[]> => {
  const cards: Card[] = [];
  
  // Add 3 guaranteed common cards
  for (let i = 0; i < 3; i++) {
    const commonCard = await getRandomCardByRarity('COMMON');
    cards.push(commonCard);
  }
  
  // Add 1 bonus card with rarity chances
  const bonusCard = await getRandomCardWithRarityChance();
  cards.push(bonusCard);
  
  return cards;
};

const getRandomCardWithRarityChance = async (): Promise<Card> => {
  const roll = Math.random() * 100; // 0-100
  let cumulativeChance = 0;
  
  for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
    cumulativeChance += chance;
    if (roll <= cumulativeChance) {
      return await getRandomCardByRarity(rarity as CardRarity);
    }
  }
  
  // Fallback to common (should never reach here)
  return await getRandomCardByRarity('COMMON');
};
```

### Database Schema

#### Booster Opens
```sql
booster_opens:
  id: serial primary key
  user_id: integer references users(id)
  cost: integer default 100
  opened_at: timestamp default now()
```

#### Booster Cards
```sql
booster_cards:
  id: serial primary key
  booster_open_id: integer references booster_opens(id)
  card_id: integer references cards(id)
```

### Pack Opening Process
```typescript
const openBoosterPack = async (userId: number): Promise<BoosterResult> => {
  return await prisma.$transaction(async (tx) => {
    // 1. Validate user has enough currency
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (user.currency < BOOSTER_CONFIG.cost) {
      throw new Error('Insufficient currency');
    }
    
    // 2. Deduct currency
    await tx.user.update({
      where: { id: userId },
      data: { currency: user.currency - BOOSTER_CONFIG.cost }
    });
    
    // 3. Generate random cards
    const selectedCards = await generateBoosterPack();
    
    // 4. Create booster open record
    const boosterOpen = await tx.boosterOpen.create({
      data: {
        userId,
        cost: BOOSTER_CONFIG.cost
      }
    });
    
    // 5. Record which cards were opened
    for (const card of selectedCards) {
      await tx.boosterCard.create({
        data: {
          boosterOpenId: boosterOpen.id,
          cardId: card.id
        }
      });
      
      // 6. Add cards to user's collection
      await tx.userCard.upsert({
        where: { userId_cardId: { userId, cardId: card.id } },
        update: { quantity: { increment: 1 } },
        create: { userId, cardId: card.id, quantity: 1 }
      });
    }
    
    // 7. Create transaction record
    await tx.transaction.create({
      data: {
        userId,
        type: 'SPENT_BOOSTER',
        amount: -BOOSTER_CONFIG.cost,
        description: 'Opened booster pack',
        boosterOpenId: boosterOpen.id
      }
    });
    
    return {
      cards: selectedCards,
      cost: BOOSTER_CONFIG.cost
    };
  });
};
```

## Mobile UI Implementation

### Shop Screen Integration
```typescript
const BoosterPackCard = ({ userCurrency, onPurchase }: BoosterPackProps) => {
  const canAfford = userCurrency >= BOOSTER_CONFIG.cost;
  
  return (
    <View style={styles.boosterCard}>
      <Ionicons name="gift" size={48} color="#FF6B35" />
      
      <Text style={styles.title}>Cyclist Booster Pack</Text>
      <Text style={styles.description}>
        Contains 4 cards with a chance for rare cyclists
      </Text>
      
      <View style={styles.contents}>
        <Text>• 3 Common cards guaranteed</Text>
        <Text>• 1 card with rarity bonus chance</Text>
        <Text>• 0.5% chance for Legendary card!</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.price}>
          <Ionicons name="cash" size={16} color="#FFD700" />
          <Text>{BOOSTER_CONFIG.cost}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.buyButton, !canAfford && styles.disabled]}
          onPress={onPurchase}
          disabled={!canAfford}
        >
          <Text style={styles.buyText}>Open Pack</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### Pack Opening Animation
```typescript
const PackOpeningModal = ({ cards, onClose }: PackOpeningProps) => {
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  
  useEffect(() => {
    // Animate card reveals sequentially
    cards.forEach((card, index) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, card]);
        // Play haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, index * 800);
    });
  }, [cards]);
  
  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.packContainer}>
        <Text style={styles.title}>Pack Opened!</Text>
        
        <View style={styles.cardGrid}>
          {revealedCards.map((card, index) => (
            <Animated.View
              key={card.id}
              entering={FadeIn.delay(index * 800)}
              style={[
                styles.cardSlot,
                { borderColor: rarityColors[card.rarity] }
              ]}
            >
              <Image source={{ uri: card.imageUrl }} style={styles.cardImage} />
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={[styles.rarity, { color: rarityColors[card.rarity] }]}>
                {card.rarity}
              </Text>
            </Animated.View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
```

## Pack Opening History

### API Endpoint
```typescript
// GET /api/boosters/history
const getBoosterHistory = async (userId: number, limit = 10) => {
  return await BoosterOpen.findMany({
    where: { userId },
    orderBy: { openedAt: 'desc' },
    take: limit,
    include: {
      cards: {
        include: { card: true }
      }
    }
  });
};
```

### History Display
```typescript
const PackHistory = ({ history }: { history: BoosterOpen[] }) => {
  return (
    <FlatList
      data={history}
      renderItem={({ item }) => (
        <View style={styles.historyItem}>
          <Text style={styles.date}>
            {format(item.openedAt, 'MMM dd, yyyy')}
          </Text>
          <View style={styles.cards}>
            {item.cards.map(({ card }) => (
              <View 
                key={card.id}
                style={[styles.miniCard, { borderColor: rarityColors[card.rarity] }]}
              >
                <Text style={styles.miniCardName}>{card.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
};
```

## Probability Verification

### Statistics Tracking
```typescript
// Track actual rarity distribution
const getPackStatistics = async (userId?: number) => {
  const query = userId 
    ? { where: { userId } }
    : {};
    
  const boosterCards = await BoosterCard.findMany({
    ...query,
    include: { card: true }
  });
  
  const rarityDistribution = boosterCards.reduce((acc, bc) => {
    acc[bc.card.rarity] = (acc[bc.card.rarity] || 0) + 1;
    return acc;
  }, {} as Record<CardRarity, number>);
  
  const total = boosterCards.length;
  
  return Object.entries(rarityDistribution).map(([rarity, count]) => ({
    rarity,
    count,
    percentage: (count / total) * 100,
    expected: RARITY_CHANCES[rarity as CardRarity]
  }));
};
```

## Future Enhancements

### Pack Varieties
- **Premium Packs**: Higher cost, better odds
- **Themed Packs**: Sport-specific card collections
- **Event Packs**: Limited-time special cards

### Advanced Features
- **Pack Bundles**: Bulk purchase discounts
- **Guaranteed Rare Packs**: Every 10th pack guarantees rare+
- **Pity Timer**: Increasing odds after unlucky streaks
- **Preview System**: See potential cards before opening

### Social Features
- **Gift Packs**: Send packs to friends
- **Pack Sharing**: Share exciting pack openings
- **Group Openings**: Open packs simultaneously with friends