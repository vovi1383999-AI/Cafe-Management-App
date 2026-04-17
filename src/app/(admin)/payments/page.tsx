import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({ include: { order: true, user: true }, orderBy: { paidAt: 'desc' }, take: 50 });
  return (
    <PageShell title="Thanh toán">
      <table className="w-full text-sm">
        <thead><tr><th>Mã</th><th>Order</th><th>Method</th><th>Số tiền</th><th>Thu ngân</th><th></th></tr></thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-t">
              <td>{payment.id.slice(0, 8)}</td><td>{payment.orderId.slice(0, 8)}</td><td>{payment.method}</td><td>{Number(payment.amount).toLocaleString('vi-VN')}</td><td>{payment.user.fullName}</td>
              <td><Link className="text-blue-700" href={`/payments/${payment.id}`}>Chi tiết</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
