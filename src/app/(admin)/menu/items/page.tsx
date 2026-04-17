import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageShell } from '@/components/page-shell';

export default async function MenuItemsPage() {
  const items = await prisma.menuItem.findMany({ include: { category: true }, orderBy: { name: 'asc' } });

  return (
    <PageShell title="Món bán">
      <div className="mb-4"><Link href="/menu/items/new" className="rounded bg-espresso px-3 py-2 text-sm text-crema">+ Tạo món</Link></div>
      <table className="w-full text-sm">
        <thead><tr><th>Tên</th><th>SKU</th><th>Danh mục</th><th>Giá</th><th></th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td>{item.name}</td><td>{item.sku}</td><td>{item.category.name}</td><td>{Number(item.price).toLocaleString('vi-VN')}</td>
              <td><Link className="text-blue-700" href={`/menu/items/${item.id}/edit`}>Sửa</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
