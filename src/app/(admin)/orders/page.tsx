import Link from 'next/link';
import { OrderType } from '@prisma/client';
import { createOrderAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function OrdersPage() {
  const [orders, tables] = await Promise.all([
    prisma.order.findMany({ include: { table: true, user: true }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.cafeTable.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } })
  ]);

  return (
    <PageShell title="Quản lý đơn hàng">
      <form action={createOrderAction} className="mb-6 grid gap-2 rounded border p-3 md:grid-cols-4">
        <select name="tableId" className="rounded border px-2 py-2">
          <option value="">Takeaway (không bàn)</option>
          {tables.map((table) => <option key={table.id} value={table.id}>{table.code} - {table.name}</option>)}
        </select>
        <select name="orderType" className="rounded border px-2 py-2" defaultValue={OrderType.DINE_IN}>
          {Object.values(OrderType).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="note" placeholder="Ghi chú" className="rounded border px-2 py-2" />
        <button className="rounded bg-espresso px-3 py-2 text-crema">Tạo Order</button>
      </form>
      <table className="w-full text-sm">
        <thead><tr><th>Mã</th><th>Bàn</th><th>Loại</th><th>Trạng thái</th><th>Thu ngân</th><th></th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td>{order.id.slice(0, 8)}</td><td>{order.table?.code ?? '-'}</td><td>{order.orderType}</td><td>{order.status}</td><td>{order.user.fullName}</td>
              <td><Link className="text-blue-700" href={`/orders/${order.id}`}>Chi tiết</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
