import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'demo@sahibindenclone.com' },
      update: {},
      create: {
        email: 'demo@sahibindenclone.com',
        name: 'Demo Kullanıcı',
        surname: 'Test',
        password: 'demo', 
        phone: '5554443322',
        role: 'INDIVIDUAL'
      }
    })
    console.log('✅ Demo kullanıcı veritabanında mevcut:', user.email)
  } catch (e) {
    console.error('Kullanıcı oluşturma hatası:', e)
  } finally {
    await prisma.$disconnect()
  }
}
main()