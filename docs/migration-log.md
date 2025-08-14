# Migration Log

## 2025 World Tour Cyclists Migration

**Date**: August 14, 2025  
**Type**: Major collection overhaul  
**Status**: ✅ Complete

### Overview
Migrated from a multi-sport legendary athletes collection to exclusively featuring World Tour professional cyclists.

### Migration Details

#### Data Collection
- **Source**: [ProCyclingStats.com rankings](https://www.procyclingstats.com/rankings.php?p=individual&s=&nation=&age=&page=smallerorequal&team=&offset=0&teamlevel=&filter=Filter)
- **Cyclists Collected**: 135 top-ranked World Tour riders
- **Data Points**: Name, team, nationality, rankings, achievements
- **Achievement Research**: Detailed descriptions for each cyclist's notable wins and specializations

#### Database Changes
- **Cards Removed**: All existing multi-sport athlete cards
- **Cards Added**: 135 World Tour cyclist cards
- **Schema Updates**: None required (existing schema compatible)
- **Rarity Distribution**:
  - 1 Legendary: Tadej Pogačar
  - 4 Epic: Mads Pedersen, Oscar Onley, Remco Evenepoel, Mathieu van der Poel
  - 15 Rare: Monument winners and world champions
  - 34 Uncommon: Stage winners and strong performers
  - 81 Common: Professional World Tour riders

#### Documentation Updates
- `README.md`: Updated project description and key features
- `docs/README.md`: Updated project overview
- `docs/features/card-collection.md`: Complete revision for cycling focus
- `docs/features/booster-packs.md`: Updated messaging
- `CLAUDE.md`: Updated project documentation with new theme

#### Code Changes
- **New Seeding Script**: `prisma/seed-cards-worldtour.ts`
- **Mobile App Updates**: 
  - Updated `CollectionScreen.tsx` filters (removed "Sport", added "Score")
  - Updated UI messaging for World Tour cyclists
- **TypeScript Fixes**: Resolved type errors in booster service
- **Seed Script Updates**: Modified to use new World Tour seeding

### Migration Script Details

#### Data Processing
```typescript
// Rarity assignment based on ProCyclingStats ranking
const assignRarity = (rank: number): CardRarity => {
  if (rank === 1) return CardRarity.LEGENDARY  // Tadej Pogačar
  if (rank <= 5) return CardRarity.EPIC        // Top 4 performers
  if (rank <= 20) return CardRarity.RARE       // Elite cyclists
  if (rank <= 54) return CardRarity.UNCOMMON   // Strong performers  
  return CardRarity.COMMON                     // Professional riders
}
```

#### Birth Year Estimation
- Used known birth years for top cyclists
- Estimated based on typical career progression for unknowns
- Age ranges: 24-40 years old (born 1985-2001)

### Files Created/Modified

#### New Files
- `/server/prisma/seed-cards-worldtour.ts` - World Tour cyclist seeding script
- `/top-135-world-tour-cyclists-2025.json` - Raw cyclist data
- `/docs/migration-log.md` - This migration log

#### Modified Files
- `/README.md` - Project description updates
- `/docs/README.md` - Documentation overview
- `/docs/features/card-collection.md` - Complete cycling revision
- `/docs/features/booster-packs.md` - UI messaging updates  
- `/CLAUDE.md` - Project documentation updates
- `/mobile/src/screens/CollectionScreen.tsx` - Filter updates
- `/server/src/scripts/seed.ts` - Updated to use World Tour seeding
- `/server/src/services/boosterService.ts` - TypeScript fixes

### Card ID Structure Reset (August 2025)

#### ID Reorganization
- **Previous IDs**: Started at 202, ended at 336
- **New IDs**: Sequential from 1 to 135
- **Next Available ID**: 136 (ready for future collections)

#### ID Ranges by Rarity
```
LEGENDARY: 1 card  (ID 1)
EPIC:      4 cards (IDs 2-5)  
RARE:      15 cards (IDs 6-20)
UNCOMMON:  34 cards (IDs 21-54)
COMMON:    81 cards (IDs 55-135)
```

#### Key Benefits
- **Clean Sequential IDs**: No gaps, starts from 1
- **Predictable Structure**: Rarity-based ID ranges
- **Future-Ready**: Sequence set to continue from 136
- **Logical Ordering**: Legendary → Epic → Rare → Uncommon → Common

### Verification Results
```
Total cards: 135
ID range: 1 to 135
Card Distribution:
- LEGENDARY: 1 card (ID 1 - Tadej Pogačar)
- EPIC: 4 cards (IDs 2-5)  
- RARE: 15 cards (IDs 6-20)
- UNCOMMON: 34 cards (IDs 21-54)
- COMMON: 81 cards (IDs 55-135)
```

### Future Migration Considerations
1. **Annual Updates**: Plan yearly collection refreshes
2. **Data Sources**: Maintain ProCyclingStats.com as primary source
3. **Rarity Rebalancing**: Adjust distribution based on season performance
4. **Achievement Updates**: Research new wins and milestones
5. **User Impact**: Consider user collection preservation strategies
6. **ID Management**: 
   - New cards start from ID 136
   - Maintain sequential ID structure for clean organization
   - Consider ID ranges when planning collection size changes

### Rollback Plan
- Backup created at `/server/prisma/seed-cards-endurance.ts`
- Original multi-sport data preserved
- Database rollback: `npx tsx prisma/seed-cards-endurance.ts`

---

*Migration completed successfully with all systems operational.*