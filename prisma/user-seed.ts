import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs' // Bu paketin yüklü olduğundan emin olun

const prisma = new PrismaClient()

async function main() {
  try {
    // Şifreyi hash'liyoruz
    const hashedPassword = await bcrypt.hash('demo', 10);

    const user = await prisma.user.upsert({
      where: { email: 'demo@sahibindenclone.com' },
      update: {
        password: hashedPassword // Güncelleme durumunda da hash'i yenile
      },
      create: {
        email: 'demo@sahibindenclone.com',
        name: 'Demo Kullanıcı',
        surname: 'Test',
        password: hashedPassword, // Hash'lenmiş şifre
        phone: '5554443322',
        role: 'INDIVIDUAL'
      }
    })
    console.log('✅ Demo kullanıcı oluşturuldu/güncellendi:', user.email)
    console.log('🔑 Şifre: demo')
  } catch (e) {
    console.error('Kullanıcı oluşturma hatası:', e)
  } finally {
    await prisma.$disconnect()
  }
}
main()