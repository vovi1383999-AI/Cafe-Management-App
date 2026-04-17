import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function InventoryPage() {
  const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });

  return (
    <PageShell title="Tồn kho">
      <div className="mb-4"><Link href="/inventory/new" className="rounded bg-espresso px-3 py-2 text-sm text-crema">+ Tạo nguyên liệu</Link></div>
      <table className="w-full text-sm">
        <thead><tr><th>Tên</th><th>Tồn hiện tại</th><th>Min</th><th>Đơn vị</th><th></th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td>{item.name}</td><td>{Number(item.currentStock)}</td><td>{Number(item.minStock)}</td><td>{item.unit}</td>
              <td><Link className="text-blue-700" href={`/inventory/${item.id}/edit`}>Sửa</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
