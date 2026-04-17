import { StockTransactionType } from '@prisma/client';
import { createStockTransactionAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function InventoryTransactionsPage() {
  const [txns, items, shifts] = await Promise.all([
    prisma.stockTransaction.findMany({ include: { item: true, user: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.inventoryItem.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.shift.findMany({ where: { status: 'OPEN' }, orderBy: { openedAt: 'desc' }, take: 1 })
  ]);

  return (
    <PageShell title="Lịch sử nhập/xuất kho">
      <form action={createStockTransactionAction} className="mb-6 grid gap-2 rounded border p-3 md:grid-cols-5">
        <select name="inventoryItemId" className="rounded border px-2 py-2" required>
          <option value="">Chọn nguyên liệu</option>
          {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select name="type" className="rounded border px-2 py-2" defaultValue={StockTransactionType.IN}>
          {Object.values(StockTransactionType).map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input name="quantity" type="number" step="0.01" min="0.01" placeholder="Số lượng" className="rounded border px-2 py-2" required />
        <input name="note" placeholder="Ghi chú" className="rounded border px-2 py-2" />
        <input type="hidden" name="shiftId" value={shifts[0]?.id ?? ''} />
        <button className="rounded bg-stone-900 px-3 py-2 text-white">Ghi nhận</button>
      </form>

      <table className="w-full text-sm">
        <thead><tr><th>Thời gian</th><th>Nguyên liệu</th><th>Loại</th><th>Số lượng</th><th>Người thao tác</th></tr></thead>
        <tbody>
          {txns.map((txn) => (
            <tr key={txn.id} className="border-t">
              <td>{txn.createdAt.toLocaleString('vi-VN')}</td><td>{txn.item.name}</td><td>{txn.type}</td><td>{Number(txn.quantity)}</td><td>{txn.user.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
