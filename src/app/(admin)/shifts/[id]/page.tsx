import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function ShiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shift = await prisma.shift.findUnique({
    where: { id },
    include: {
      openedBy: true,
      closedBy: true,
      transactions: { include: { item: true, user: true }, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!shift) notFound();

  return (
    <PageShell title={`Chi tiết ca ${shift.code}`}>
      <ul className="mb-4 grid gap-1 text-sm md:grid-cols-2">
        <li>Trạng thái: {shift.status}</li>
        <li>Mở bởi: {shift.openedBy.fullName}</li>
        <li>Mở lúc: {shift.openedAt.toLocaleString('vi-VN')}</li>
        <li>Tiền đầu ca: {Number(shift.openingCash).toLocaleString('vi-VN')}</li>
        <li>Đóng bởi: {shift.closedBy?.fullName ?? '-'}</li>
        <li>Tiền cuối ca: {shift.closingCash ? Number(shift.closingCash).toLocaleString('vi-VN') : '-'}</li>
      </ul>

      <h2 className="mb-2 font-semibold">Stock transactions trong ca</h2>
      <table className="w-full text-sm">
        <thead><tr><th>Thời gian</th><th>Nguyên liệu</th><th>Loại</th><th>SL</th><th>Người thao tác</th></tr></thead>
        <tbody>
          {shift.transactions.map((txn) => (
            <tr key={txn.id} className="border-t">
              <td>{txn.createdAt.toLocaleString('vi-VN')}</td><td>{txn.item.name}</td><td>{txn.type}</td><td>{Number(txn.quantity)}</td><td>{txn.user.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
