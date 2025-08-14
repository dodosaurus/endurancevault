import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Run the World Tour cyclists seeding script
    console.log('Running World Tour cyclist card seeding...')
    await execAsync('npx tsx prisma/seed-cards-worldtour.ts')
    
    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

main()