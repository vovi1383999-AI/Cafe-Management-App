import { closeCurrentShiftAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';

export default function CloseShiftPage() {
  return (
    <PageShell title="Đóng ca">
      <form action={closeCurrentShiftAction} className="grid max-w-lg gap-3">
        <input name="closingCash" type="number" min={0} step="1000" placeholder="Tiền cuối ca" className="rounded border px-3 py-2" required />
        <textarea name="note" placeholder="Ghi chú cuối ca" className="rounded border px-3 py-2" />
        <button className="rounded bg-red-700 px-4 py-2 text-white">Đóng ca</button>
      </form>
    </PageShell>
  );
}
