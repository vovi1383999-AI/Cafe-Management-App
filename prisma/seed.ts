import { PrismaClient, UserRole, TableStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cafe.local' },
    update: {},
    create: {
      email: 'admin@cafe.local',
      fullName: 'Cafe Admin',
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  await prisma.cafeTable.createMany({
    data: [
      { code: 'T1', name: 'Bàn 1', capacity: 4, status: TableStatus.AVAILABLE },
      { code: 'T2', name: 'Bàn 2', capacity: 2, status: TableStatus.AVAILABLE }
    ],
    skipDuplicates: true
  });

  const drinks = await prisma.menuCategory.upsert({
    where: { name: 'Đồ uống' },
    update: {},
    create: { name: 'Đồ uống', description: 'Coffee, tea, juice', sortOrder: 1 }
  });

  await prisma.menuItem.upsert({
    where: { sku: 'CF-BLK-001' },
    update: {},
    create: {
      categoryId: drinks.id,
      name: 'Cà phê đen',
      price: 30000,
      sku: 'CF-BLK-001'
    }
  });

  await prisma.inventoryItem.createMany({
    data: [
      { name: 'Hạt cà phê', unit: 'kg', currentStock: 10, minStock: 2 },
      { name: 'Sữa tươi', unit: 'lít', currentStock: 20, minStock: 5 }
    ],
    skipDuplicates: true
  });

  console.log(`Seeded admin user: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
