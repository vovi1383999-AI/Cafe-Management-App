import { notFound } from 'next/navigation';
import { addOrderItemAction, payOrderAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { menuItem: true } }, payment: true, table: true }
  });

  if (!order) notFound();
  const menu = await prisma.menuItem.findMany({ where: { isAvailable: true }, orderBy: { name: 'asc' } });

  return (
    <PageShell title={`Chi tiết Order ${order.id.slice(0, 8)}`}>
      <p className="mb-4 text-sm">Bàn: {order.table?.name ?? 'Takeaway'} | Trạng thái: {order.status}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold">Danh sách món</h2>
          <ul className="space-y-1 text-sm">
            {order.items.map((item) => <li key={item.id}>{item.menuItem.name} x {item.quantity} = {(Number(item.unitPrice) * item.quantity).toLocaleString('vi-VN')}</li>)}
          </ul>
        </div>

        <div className="space-y-3">
          <form action={addOrderItemAction} className="grid gap-2 rounded border p-3">
            <input type="hidden" name="orderId" value={order.id} />
            <select name="menuItemId" className="rounded border px-2 py-2" required>
              <option value="">Chọn món</option>
              {menu.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <input name="quantity" type="number" min={1} defaultValue={1} className="rounded border px-2 py-2" required />
            <button className="rounded bg-stone-900 px-3 py-2 text-white">Thêm món</button>
          </form>

          <form action={payOrderAction} className="grid gap-2 rounded border p-3">
            <input type="hidden" name="orderId" value={order.id} />
            <select name="method" className="rounded border px-2 py-2" required>
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
              <option value="E_WALLET">E_WALLET</option>
              <option value="BANK_TRANSFER">BANK_TRANSFER</option>
            </select>
            <button disabled={Boolean(order.payment)} className="rounded bg-green-700 px-3 py-2 text-white disabled:bg-stone-300">
              {order.payment ? 'Đã thanh toán' : 'Thanh toán'}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
