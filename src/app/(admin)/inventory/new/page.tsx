import { createInventoryItemAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';

export default function NewInventoryPage() {
  return (
    <PageShell title="Tạo nguyên liệu">
      <form action={createInventoryItemAction} className="grid max-w-lg gap-3">
        <input name="name" placeholder="Tên nguyên liệu" required className="rounded border px-3 py-2" />
        <input name="unit" placeholder="Đơn vị (kg/lít/gói...)" required className="rounded border px-3 py-2" />
        <input name="currentStock" type="number" min={0} step="0.01" defaultValue={0} required className="rounded border px-3 py-2" />
        <input name="minStock" type="number" min={0} step="0.01" defaultValue={0} required className="rounded border px-3 py-2" />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Lưu</button>
      </form>
    </PageShell>
  );
}
