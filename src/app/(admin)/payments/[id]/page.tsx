import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payment = await prisma.payment.findUnique({ where: { id }, include: { order: true, user: true } });
  if (!payment) notFound();

  return (
    <PageShell title={`Chi tiết thanh toán ${payment.id.slice(0, 8)}`}>
      <ul className="space-y-2 text-sm">
        <li>Order ID: {payment.orderId}</li>
        <li>Phương thức: {payment.method}</li>
        <li>Số tiền: {Number(payment.amount).toLocaleString('vi-VN')}</li>
        <li>Thu ngân: {payment.user.fullName}</li>
      </ul>
    </PageShell>
  );
}
