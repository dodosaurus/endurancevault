import { PrismaClient, CardRarity } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

interface CyclistData {
  rank: number
  name: string
  nationality: string
  team: string
  points: number
  specialization: string
  achievements: string
}

interface CardData {
  name: string
  sport: string
  rarity: CardRarity
  description: string
  nationality: string
  birthYear: number | null
  imageUrl: string
  baseScore: number
}

// Load cyclist data
const loadCyclistData = (): CyclistData[] => {
  const filePath = join(__dirname, '../../top-135-world-tour-cyclists-2025.json')
  const data = JSON.parse(readFileSync(filePath, 'utf8'))
  return data.cyclists
}

// Assign rarities based on ranking and achievements
const assignRarity = (rank: number): CardRarity => {
  if (rank === 1) return CardRarity.LEGENDARY  // 1 card: Tadej Pogačar
  if (rank <= 5) return CardRarity.EPIC        // 4 cards: ranks 2-5
  if (rank <= 20) return CardRarity.RARE       // 15 cards: ranks 6-20
  if (rank <= 54) return CardRarity.UNCOMMON   // 34 cards: ranks 21-54
  return CardRarity.COMMON                     // 81 cards: ranks 55-135
}

// Get base score based on rarity
const getBaseScore = (rarity: CardRarity): number => {
  switch (rarity) {
    case CardRarity.LEGENDARY: return 100
    case CardRarity.EPIC: return 25
    case CardRarity.RARE: return 8
    case CardRarity.UNCOMMON: return 3
    case CardRarity.COMMON: return 1
  }
}

// Extract birth year from achievements or estimate based on typical career patterns
const estimateBirthYear = (cyclist: CyclistData): number => {
  // Known birth years for top cyclists
  const knownBirthYears: Record<string, number> = {
    'Tadej Pogačar': 1998,
    'Mads Pedersen': 1996,
    'Oscar Onley': 2001,
    'Remco Evenepoel': 2000,
    'Mathieu van der Poel': 1995,
    'Jonas Vingegaard': 1996,
    'Primož Roglič': 1989,
    'Wout van Aert': 1994,
    'Mark Cavendish': 1985,
    'Jonathan Milan': 1999,
    'Egan Bernal': 1997,
    'Geraint Thomas': 1986,
    'Chris Froome': 1985,
    'Peter Sagan': 1990,
    'Julian Alaphilippe': 1992,
    'Adam Yates': 1992,
    'Tom Pidcock': 1999,
    'Filippo Ganna': 1996
  }
  
  if (knownBirthYears[cyclist.name]) {
    return knownBirthYears[cyclist.name]
  }
  
  // Try to extract year from achievements
  const yearMatch = cyclist.achievements.match(/\b(19|20)\d{2}\b/g)
  if (yearMatch) {
    const years = yearMatch.map(y => parseInt(y)).sort()
    // Assume professional cycling career starts around age 20-25
    const earliestYear = years[0]
    if (earliestYear > 2010) {
      return earliestYear - 23 // Rough estimate
    }
  }
  
  // Estimate based on ranking (higher ranked riders are often younger in current cycling)
  if (cyclist.rank <= 20) return 1997 // Around 28 years old in 2025
  if (cyclist.rank <= 50) return 1995 // Around 30 years old in 2025  
  if (cyclist.rank <= 100) return 1993 // Around 32 years old in 2025
  return 1991 // Around 34 years old in 2025
}

// Convert cyclist data to card data
const convertToCardData = (cyclists: CyclistData[]): CardData[] => {
  return cyclists.map(cyclist => {
    const rarity = assignRarity(cyclist.rank)
    const baseScore = getBaseScore(rarity)
    const birthYear = estimateBirthYear(cyclist)
    
    return {
      name: cyclist.name,
      sport: 'Road Cycling',
      rarity,
      description: cyclist.achievements.substring(0, 500), // Limit description length
      nationality: cyclist.nationality,
      birthYear,
      imageUrl: `https://via.placeholder.com/300x400/${getRarityColor(rarity)}/FFFFFF?text=${encodeURIComponent(cyclist.name.replace(' ', '+'))}`,
      baseScore
    }
  })
}

// Get color for rarity
const getRarityColor = (rarity: CardRarity): string => {
  switch (rarity) {
    case CardRarity.LEGENDARY: return 'FFA500' // Orange
    case CardRarity.EPIC: return '8B5CF6'      // Purple  
    case CardRarity.RARE: return '3B82F6'      // Blue
    case CardRarity.UNCOMMON: return '10B981'  // Green
    case CardRarity.COMMON: return '6B7280'    // Gray
  }
}

async function seedWorldTourCards() {
  console.log('🚴 Starting World Tour cyclist card seeding...')
  
  try {
    // Load cyclist data
    const cyclists = loadCyclistData()
    console.log(`Loaded ${cyclists.length} cyclists`)
    
    // Convert to card data
    const cardData = convertToCardData(cyclists)
    
    // Clear existing cards and related data
    console.log('Clearing existing cards and related data...')
    await prisma.boosterCard.deleteMany()
    await prisma.userCard.deleteMany()
    await prisma.card.deleteMany()
    console.log('Cleared existing cards')
    
    // Reset sequence to start from 1 for clean ID assignment
    console.log('Resetting card ID sequence to start from 1...')
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "cards_id_seq" RESTART WITH 1`)
    
    // Insert cards in rarity order to ensure proper ID assignment
    console.log('Inserting cards with sequential IDs starting from 1...')
    const rarityOrder = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'] as const
    let insertedCount = 0
    
    for (const rarityLevel of rarityOrder) {
      const cardsInRarity = cardData
        .filter(card => card.rarity === rarityLevel)
        .sort((a, b) => a.name.localeCompare(b.name))
      
      console.log(`Inserting ${cardsInRarity.length} ${rarityLevel} cards...`)
      
      for (const card of cardsInRarity) {
        await prisma.card.create({ data: card })
        insertedCount++
      }
    }
    
    // Set sequence to continue from next available ID for future additions
    const nextId = insertedCount + 1
    console.log(`Setting sequence to continue from ID ${nextId} for future cards...`)
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "cards_id_seq" RESTART WITH ${nextId}`)
    
    console.log(`✅ Successfully seeded ${insertedCount} World Tour cyclist cards with sequential IDs`)
    
    // Show distribution by rarity with ID ranges
    const rarityDistribution = await prisma.card.groupBy({
      by: ['rarity'],
      _count: { id: true },
      _min: { id: true },
      _max: { id: true }
    })
    
    console.log('\n📊 Card Distribution with ID Ranges:')
    const sortedDistribution = rarityDistribution.sort((a, b) => {
      const order = { 'LEGENDARY': 0, 'EPIC': 1, 'RARE': 2, 'UNCOMMON': 3, 'COMMON': 4 }
      return order[a.rarity] - order[b.rarity]
    })
    
    sortedDistribution.forEach(group => {
      console.log(`${group.rarity}: ${group._count.id} cards (IDs ${group._min.id}-${group._max.id})`)
    })
    
    // Show key cards with their new IDs
    console.log('\n🏆 Key Cards with IDs:')
    const legendaryCard = await prisma.card.findFirst({
      where: { rarity: CardRarity.LEGENDARY }
    })
    if (legendaryCard) {
      console.log(`ID ${legendaryCard.id}: ${legendaryCard.name} (LEGENDARY)`)
    }
    
    const epicCards = await prisma.card.findMany({
      where: { rarity: CardRarity.EPIC },
      take: 4,
      orderBy: { id: 'asc' }
    })
    console.log('EPIC:')
    epicCards.forEach(card => {
      console.log(`  ID ${card.id}: ${card.name}`)
    })
    
    console.log(`\n🎯 Next new card will receive ID ${nextId}`)
    
  } catch (error) {
    console.error('❌ Error seeding World Tour cards:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export { seedWorldTourCards }

if (require.main === module) {
  seedWorldTourCards()
}