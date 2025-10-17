const { PrismaClient } = require('../lib/generated/prisma')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing database connection...')
    
    // Test connection with a simple query
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful!')
    
    // Test both URLs by checking connection info
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`
    console.log('📊 Connection details:', result[0])
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  }
}

testConnection()