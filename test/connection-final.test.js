const { prisma, testConnection } = require('../lib/prisma.ts')

async function runTests() {
  console.log('🔍 Testing Prisma database connection...')
  console.log('📊 Using DATABASE_URL for connection pooling')
  console.log('🔗 Using DIRECT_URL for migrations')
  
  const isConnected = await testConnection()
  
  if (isConnected) {
    try {
      // Test basic query
      const result = await prisma.$queryRaw`SELECT NOW() as current_time, current_database() as db_name`
      console.log('⏰ Current time:', result[0].current_time)
      console.log('🗄️  Database name:', result[0].db_name)
      
      console.log('✅ All database tests passed!')
    } catch (queryError) {
      console.error('❌ Query test failed:', queryError.message)
    }
  }
  
  await prisma.$disconnect()
  console.log('👋 Connection closed')
}

runTests().catch(console.error)