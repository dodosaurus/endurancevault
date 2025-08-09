# Currency System

## Overview
The in-app currency system rewards users for physical activities and provides the economy for purchasing booster packs and other features.

## Currency Mechanics

### Base Currency: "Coins"
- **Symbol**: Diamond icon (💎)
- **Earning Methods**: Activity completion, bonuses, achievements
- **Spending Methods**: Booster packs, rerolls, future features
- **Storage**: Integer value in database

### Starting Balance
```typescript
const NEW_USER_BONUS = 500; // 5 booster packs worth
```

## Earning Currency

### Activity-Based Rewards
```typescript
// Base formula: Distance (km) × Base Rate × Activity Multiplier
const BASE_RATE = 10; // coins per kilometer

const ACTIVITY_MULTIPLIERS = {
  RUN: 2.0,      // 20 coins/km - highest reward for intensity
  RIDE: 0.5,     // 5 coins/km - lower due to higher distances
  WALK: 1.0,     // 10 coins/km - baseline reward  
  HIKE: 1.0,     // 10 coins/km - same as walking
  OTHER: 1.0     // 10 coins/km - default for other activities
};

// Example calculations:
// 5km run: 5 × 10 × 2.0 = 100 coins
// 30km bike ride: 30 × 10 × 0.5 = 150 coins  
// 3km walk: 3 × 10 × 1.0 = 30 coins
```

### Bonus Rewards
```typescript
enum TransactionType {
  EARNED_ACTIVITY,  // From syncing activities
  EARNED_BONUS,     // New user bonus, achievements, etc.
  SPENT_BOOSTER,    // Purchasing booster packs
  SPENT_REROLL      // Card reroll mechanics (future)
}
```

## Spending Currency

### Current Spending Options
```typescript
const PRICES = {
  BOOSTER_PACK: 100,      // Standard 4-card booster
  REROLL_3_CARDS: 50      // Future: reroll 3 cards of same rarity
};
```

### Purchase Validation
```typescript
const canAfford = (userCurrency: number, itemCost: number): boolean => {
  return userCurrency >= itemCost;
};

const deductCurrency = async (userId: number, amount: number) => {
  const user = await User.findById(userId);
  if (user.currency < amount) {
    throw new Error('Insufficient currency');
  }
  
  await User.update(userId, {
    currency: user.currency - amount
  });
};
```

## Transaction System

### Database Schema
```sql
transactions:
  id: serial primary key
  user_id: integer references users(id)
  type: enum (EARNED_ACTIVITY, EARNED_BONUS, SPENT_BOOSTER, SPENT_REROLL)
  amount: integer -- positive for earning, negative for spending
  description: varchar
  booster_open_id: integer references booster_opens(id) nullable
  created_at: timestamp default now()
```

### Transaction Creation
```typescript
const createTransaction = async (data: {
  userId: number;
  type: TransactionType;
  amount: number;
  description?: string;
  boosterOpenId?: number;
}) => {
  return await Transaction.create({
    ...data,
    createdAt: new Date()
  });
};
```

### Transaction History
```typescript
// Get user's recent transactions
const getTransactionHistory = async (userId: number, limit = 20) => {
  return await Transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      boosterOpen: {
        include: { cards: { include: { card: true } } }
      }
    }
  });
};
```

## Currency Display

### Mobile UI Components
```typescript
// Currency display in header
const CurrencyDisplay = ({ amount }: { amount: number }) => (
  <View style={styles.currencyContainer}>
    <Ionicons name="diamond" size={20} color="#FFD700" />
    <Text style={styles.currencyText}>{amount.toLocaleString()}</Text>
  </View>
);

// Purchase button with affordability check
const PurchaseButton = ({ 
  cost, 
  userCurrency, 
  onPress,
  label 
}: PurchaseButtonProps) => {
  const canAfford = userCurrency >= cost;
  
  return (
    <TouchableOpacity
      style={[styles.button, !canAfford && styles.buttonDisabled]}
      onPress={onPress}
      disabled={!canAfford}
    >
      <Text style={[styles.buttonText, !canAfford && styles.buttonTextDisabled]}>
        {label} ({cost} 💎)
      </Text>
    </TouchableOpacity>
  );
};
```

### Real-time Updates
```typescript
// Update currency display after transactions
const refreshUserCurrency = async () => {
  const updatedUser = await userApi.getProfile();
  setUser(updatedUser);
};

// Example usage after booster purchase
const handlePurchaseBooster = async () => {
  try {
    await boosterApi.openBooster();
    await refreshUserCurrency(); // Update display
  } catch (error) {
    // Handle insufficient funds
  }
};
```

## Balance Management

### Concurrent Transaction Prevention
```typescript
// Database-level constraints prevent negative balances
const updateUserCurrency = async (userId: number, change: number) => {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { currency: true }
    });
    
    if (user.currency + change < 0) {
      throw new Error('Insufficient currency');
    }
    
    await tx.user.update({
      where: { id: userId },
      data: { currency: user.currency + change }
    });
  });
};
```

## Analytics & Insights

### User Currency Metrics
```typescript
interface CurrencyMetrics {
  totalEarned: number;        // Lifetime currency earned
  totalSpent: number;         // Lifetime currency spent
  currentBalance: number;     // Current currency amount
  averagePerActivity: number; // Average coins per activity
  totalActivities: number;    // Activities that earned currency
}

const getUserCurrencyMetrics = async (userId: number): Promise<CurrencyMetrics> => {
  const transactions = await Transaction.findMany({
    where: { userId }
  });
  
  const earned = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const spent = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
  
  const activities = await Activity.countMany({
    where: { userId, processed: true }
  });
  
  return {
    totalEarned: earned,
    totalSpent: spent,
    currentBalance: earned - spent,
    averagePerActivity: activities > 0 ? earned / activities : 0,
    totalActivities: activities
  };
};
```

## Future Enhancements

### Dynamic Pricing
- Seasonal multipliers for currency earning
- Special event bonuses
- Weekend activity multipliers

### Advanced Economy
- Daily/weekly currency caps to prevent exploitation
- Streak bonuses for consistent activity
- Achievement-based currency rewards
- Premium currency for special features

### Gamification
- Currency milestones with rewards
- Leaderboards based on currency earned
- Social features (gift currency to friends)
- Subscription bonuses for premium users