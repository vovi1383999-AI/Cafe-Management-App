import { prisma } from '@/lib/db';
import { PageShell } from '@/components/page-shell';

export default async function DashboardPage() {
  const [tables, openOrders, inventoryItems, openShift] = await Promise.all([
    prisma.cafeTable.count(),
    prisma.order.count({ where: { status: 'OPEN' } }),
    prisma.inventoryItem.findMany({ select: { currentStock: true, minStock: true } }),
    prisma.shift.findFirst({ where: { status: 'OPEN' } })
  ]);

  const inventoryLow = inventoryItems.filter((item) => Number(item.currentStock) <= Number(item.minStock)).length;

  return (
    <PageShell title="Dashboard vận hành">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card label="Số bàn" value={String(tables)} />
        <Card label="Order đang mở" value={String(openOrders)} />
        <Card label="Nguyên liệu thấp" value={String(inventoryLow)} />
        <Card label="Ca làm hiện tại" value={openShift ? openShift.code : 'Chưa mở'} />
      </div>
    </PageShell>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border bg-stone-50 p-4">
      <p className="text-sm text-stone-600">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
