import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function ShiftsPage() {
  const shifts = await prisma.shift.findMany({ include: { openedBy: true, closedBy: true }, orderBy: { openedAt: 'desc' }, take: 30 });
  return (
    <PageShell title="Danh sách ca làm">
      <div className="mb-4 flex gap-2">
        <Link href="/shifts/open" className="rounded bg-green-700 px-3 py-2 text-sm text-white">Mở ca</Link>
        <Link href="/shifts/close" className="rounded bg-red-700 px-3 py-2 text-sm text-white">Đóng ca</Link>
      </div>
      <table className="w-full text-sm">
        <thead><tr><th>Mã</th><th>Trạng thái</th><th>Mở bởi</th><th>Mở lúc</th><th></th></tr></thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id} className="border-t">
              <td>{shift.code}</td><td>{shift.status}</td><td>{shift.openedBy.fullName}</td><td>{shift.openedAt.toLocaleString('vi-VN')}</td>
              <td><Link className="text-blue-700" href={`/shifts/${shift.id}`}>Xem</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
