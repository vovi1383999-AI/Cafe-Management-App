import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

function getSinceDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function ReportsPage() {
  const since = getSinceDate(7);
  const [paymentAgg, orderCount] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: since } } }),
    prisma.order.count({ where: { createdAt: { gte: since } } })
  ]);

  return (
    <PageShell title="Báo cáo">
      <p className="text-sm">7 ngày gần nhất:</p>
      <ul className="mt-2 list-disc pl-5 text-sm">
        <li>Tổng doanh thu: {Number(paymentAgg._sum.amount ?? 0).toLocaleString('vi-VN')} VND</li>
        <li>Số đơn hàng: {orderCount}</li>
      </ul>
    </PageShell>
  );
}
