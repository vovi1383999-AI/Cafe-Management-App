import { createMenuItemAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function NewMenuItemPage() {
  const categories = await prisma.menuCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });

  return (
    <PageShell title="Tạo món mới">
      <form action={createMenuItemAction} className="grid max-w-xl gap-3">
        <input name="name" placeholder="Tên món" required className="rounded border px-3 py-2" />
        <input name="sku" placeholder="SKU" required className="rounded border px-3 py-2" />
        <input name="price" type="number" min={1000} step={1000} placeholder="Giá" required className="rounded border px-3 py-2" />
        <select name="categoryId" required className="rounded border px-3 py-2">
          <option value="">Chọn danh mục</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <textarea name="description" placeholder="Mô tả" className="rounded border px-3 py-2" />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Lưu</button>
      </form>
    </PageShell>
  );
}
