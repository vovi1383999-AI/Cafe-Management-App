import { UserRole } from '@prisma/client';
import { createUserAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';

export default function NewUserPage() {
  return (
    <PageShell title="Tạo người dùng">
      <form action={createUserAction} className="grid max-w-lg gap-3">
        <input name="fullName" placeholder="Họ tên" className="rounded border px-3 py-2" required />
        <input name="email" type="email" placeholder="Email" className="rounded border px-3 py-2" required />
        <select name="role" className="rounded border px-3 py-2" defaultValue={UserRole.CASHIER}>
          {Object.values(UserRole).map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <input name="password" type="password" placeholder="Mật khẩu" className="rounded border px-3 py-2" required />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Tạo</button>
      </form>
    </PageShell>
  );
}
