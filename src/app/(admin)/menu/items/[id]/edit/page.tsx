import { notFound } from 'next/navigation';
import { updateMenuItemAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.menuItem.findUnique({ where: { id } }),
    prisma.menuCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
  ]);

  if (!item) notFound();

  return (
    <PageShell title="Sửa món">
      <form action={updateMenuItemAction.bind(null, item.id)} className="grid max-w-xl gap-3">
        <input name="name" defaultValue={item.name} required className="rounded border px-3 py-2" />
        <input name="sku" defaultValue={item.sku} required className="rounded border px-3 py-2" />
        <input name="price" type="number" min={1000} step={1000} defaultValue={Number(item.price)} required className="rounded border px-3 py-2" />
        <select name="categoryId" defaultValue={item.categoryId} className="rounded border px-3 py-2" required>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <textarea name="description" defaultValue={item.description ?? ''} className="rounded border px-3 py-2" />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Cập nhật</button>
      </form>
    </PageShell>
  );
}
