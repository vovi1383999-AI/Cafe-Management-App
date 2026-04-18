import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';
import { updateTableAction } from '@/app/(admin)/actions';

export default async function EditTablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const table = await prisma.cafeTable.findUnique({ where: { id } });
  if (!table) notFound();

  return (
    <PageShell title="Sửa bàn">
      <form action={updateTableAction.bind(null, table.id)} className="grid max-w-xl gap-3">
        <input name="code" defaultValue={table.code} placeholder="Mã bàn" className="rounded border px-3 py-2" required />
        <input name="name" defaultValue={table.name} placeholder="Tên hiển thị" className="rounded border px-3 py-2" required />
        <input
          name="capacity"
          type="number"
          min={1}
          max={20}
          defaultValue={table.capacity}
          placeholder="Sức chứa"
          className="rounded border px-3 py-2"
          required
        />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Cập nhật</button>
      </form>
    </PageShell>
  );
}
