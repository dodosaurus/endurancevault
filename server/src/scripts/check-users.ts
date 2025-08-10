import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany()
    console.log(`Found ${users.length} users in database:`)
    
    users.forEach(user => {
      console.log(`- User ${user.id}: ${user.firstName} ${user.lastName} (${user.stravaId}) - Currency: ${user.currency}`)
    })
    
    if (users.length === 0) {
      console.log('\nNo users found. You need to authenticate via Strava first to test booster opening.')
    }
  } catch (error) {
    console.error('Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()