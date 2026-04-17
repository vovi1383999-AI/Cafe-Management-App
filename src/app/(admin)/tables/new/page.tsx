import { PageShell } from '@/components/page-shell';
import { createTableAction } from '@/app/(admin)/actions';

export default function NewTablePage() {
  return (
    <PageShell title="Tạo bàn mới">
      <form action={createTableAction} className="grid max-w-xl gap-3">
        <input name="code" placeholder="Mã bàn" className="rounded border px-3 py-2" required />
        <input name="name" placeholder="Tên hiển thị" className="rounded border px-3 py-2" required />
        <input name="capacity" type="number" min={1} max={20} placeholder="Sức chứa" className="rounded border px-3 py-2" required />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Lưu</button>
      </form>
    </PageShell>
  );
}
