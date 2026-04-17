import { openShiftAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';

export default function OpenShiftPage() {
  return (
    <PageShell title="Mở ca">
      <form action={openShiftAction} className="grid max-w-lg gap-3">
        <input name="openingCash" type="number" min={0} step="1000" placeholder="Tiền đầu ca" className="rounded border px-3 py-2" required />
        <textarea name="note" placeholder="Ghi chú" className="rounded border px-3 py-2" />
        <button className="rounded bg-green-700 px-4 py-2 text-white">Mở ca</button>
      </form>
    </PageShell>
  );
}
