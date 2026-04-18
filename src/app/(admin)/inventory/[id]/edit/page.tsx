import { notFound } from 'next/navigation';
import { updateInventoryItemAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function EditInventoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <PageShell title="Sửa nguyên liệu">
      <form action={updateInventoryItemAction.bind(null, item.id)} className="grid max-w-lg gap-3">
        <input name="name" defaultValue={item.name} required className="rounded border px-3 py-2" />
        <input name="unit" defaultValue={item.unit} required className="rounded border px-3 py-2" />
        <input
          name="currentStock"
          type="number"
          min={0}
          step="0.01"
          defaultValue={Number(item.currentStock)}
          required
          className="rounded border px-3 py-2"
        />
        <input name="minStock" type="number" min={0} step="0.01" defaultValue={Number(item.minStock)} required className="rounded border px-3 py-2" />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Cập nhật</button>
      </form>
    </PageShell>
  );
}
