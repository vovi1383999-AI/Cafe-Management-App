import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageShell } from '@/components/page-shell';

export default async function TablesPage() {
  const tables = await prisma.cafeTable.findMany({ orderBy: { code: 'asc' } });

  return (
    <PageShell title="Quản lý bàn">
      <div className="mb-4">
        <Link href="/tables/new" className="rounded bg-espresso px-3 py-2 text-sm font-medium text-crema">+ Tạo bàn</Link>
      </div>
      <table className="w-full text-left text-sm">
        <thead><tr><th>Mã</th><th>Tên</th><th>Sức chứa</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id} className="border-t">
              <td>{table.code}</td><td>{table.name}</td><td>{table.capacity}</td><td>{table.status}</td>
              <td><Link className="text-blue-700" href={`/tables/${table.id}/edit`}>Sửa</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
