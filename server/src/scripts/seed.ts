import { seedCards } from '../../prisma/seed-cards'

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    await seedCards()
    
    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

main()