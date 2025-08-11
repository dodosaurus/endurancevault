import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanUserData() {
  console.log('🧹 Starting user data cleanup...')
  
  try {
    // First, let's see what we have
    const users = await prisma.user.findMany({
      select: {
        id: true,
        stravaId: true,
        firstName: true,
        lastName: true,
        currency: true,
        totalScore: true
      }
    })
    
    console.log(`Found ${users.length} user(s):`)
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (ID: ${user.id}, Strava: ${user.stravaId})`)
      console.log(`  Currency: ${user.currency}, Score: ${user.totalScore}`)
    })
    
    if (users.length === 0) {
      console.log('No users found. Nothing to clean.')
      return
    }
    
    // Get counts before cleanup
    const userCardCount = await prisma.userCard.count()
    const transactionCount = await prisma.transaction.count()
    const activityCount = await prisma.activity.count()
    const boosterOpenCount = await prisma.boosterOpen.count()
    const boosterCardCount = await prisma.boosterCard.count()
    
    console.log('\n📊 Data before cleanup:')
    console.log(`- User Cards: ${userCardCount}`)
    console.log(`- Transactions: ${transactionCount}`)
    console.log(`- Activities: ${activityCount}`)
    console.log(`- Booster Opens: ${boosterOpenCount}`)
    console.log(`- Booster Cards: ${boosterCardCount}`)
    
    console.log('\n🗑️ Cleaning user data...')
    
    // Clean booster_cards first (references booster_opens)
    await prisma.boosterCard.deleteMany()
    console.log('✅ Cleared booster_cards')
    
    // Clean booster_opens
    await prisma.boosterOpen.deleteMany()
    console.log('✅ Cleared booster_opens')
    
    // Clean user_cards
    await prisma.userCard.deleteMany()
    console.log('✅ Cleared user_cards')
    
    // Clean transactions
    await prisma.transaction.deleteMany()
    console.log('✅ Cleared transactions')
    
    // Clean activities
    await prisma.activity.deleteMany()
    console.log('✅ Cleared activities')
    
    // Reset user currency and stats
    await prisma.user.updateMany({
      data: {
        currency: 500, // Starting currency
        totalScore: 0,
        lastSyncedAt: null
      }
    })
    console.log('✅ Reset user currency to 500 and cleared stats')
    
    // Verify cleanup
    const finalCounts = {
      userCards: await prisma.userCard.count(),
      transactions: await prisma.transaction.count(),
      activities: await prisma.activity.count(),
      boosterOpens: await prisma.boosterOpen.count(),
      boosterCards: await prisma.boosterCard.count()
    }
    
    console.log('\n✨ Cleanup completed! Final counts:')
    console.log(`- User Cards: ${finalCounts.userCards}`)
    console.log(`- Transactions: ${finalCounts.transactions}`)
    console.log(`- Activities: ${finalCounts.activities}`)
    console.log(`- Booster Opens: ${finalCounts.boosterOpens}`)
    console.log(`- Booster Cards: ${finalCounts.boosterCards}`)
    
    // Show final user state
    const cleanUsers = await prisma.user.findMany({
      select: {
        id: true,
        stravaId: true,
        firstName: true,
        lastName: true,
        currency: true,
        totalScore: true
      }
    })
    
    console.log('\n👤 User(s) after cleanup:')
    cleanUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (ID: ${user.id}, Strava: ${user.stravaId})`)
      console.log(`  Currency: ${user.currency}, Score: ${user.totalScore}`)
    })
    
  } catch (error) {
    console.error('❌ Error cleaning user data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  cleanUserData()
}

export { cleanUserData }