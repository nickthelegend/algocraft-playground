require('dotenv').config()

console.log('Environment variables:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'Set' : 'Not set')

// Test with direct URL
const { PrismaClient } = require('@prisma/client')

async function testDirectConnection() {
  // Override to use direct URL for testing
  process.env.DATABASE_URL = process.env.DIRECT_URL
  
  const prisma = new PrismaClient()
  
  try {
    console.log('\nTesting with DIRECT_URL...')
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Direct connection successful!')
    
  } catch (error) {
    console.error('❌ Direct connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testDirectConnection()