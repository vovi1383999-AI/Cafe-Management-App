import { createCategoryAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function MenuCategoriesPage() {
  const categories = await prisma.menuCategory.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });

  return (
    <PageShell title="Danh mục menu">
      <form action={createCategoryAction} className="mb-6 grid gap-2 rounded border p-3 md:grid-cols-4">
        <input name="name" placeholder="Tên danh mục" className="rounded border px-2 py-2" required />
        <input name="description" placeholder="Mô tả" className="rounded border px-2 py-2" />
        <input name="sortOrder" type="number" min={0} defaultValue={0} className="rounded border px-2 py-2" />
        <button className="rounded bg-espresso px-3 py-2 text-crema">Tạo danh mục</button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr><th>Tên</th><th>Mô tả</th><th>Thứ tự</th><th>Trạng thái</th></tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t">
              <td>{category.name}</td>
              <td>{category.description ?? '-'}</td>
              <td>{category.sortOrder}</td>
              <td>{category.isActive ? 'ACTIVE' : 'INACTIVE'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
