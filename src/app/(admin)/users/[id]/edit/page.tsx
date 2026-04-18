import { UserRole } from '@prisma/client';
import { notFound } from 'next/navigation';
import { updateUserAction } from '@/app/(admin)/actions';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <PageShell title="Sửa người dùng">
      <form action={updateUserAction.bind(null, user.id)} className="grid max-w-lg gap-3">
        <input name="fullName" defaultValue={user.fullName} required className="rounded border px-3 py-2" />
        <input name="email" type="email" defaultValue={user.email} required className="rounded border px-3 py-2" />
        <select name="role" defaultValue={user.role} className="rounded border px-3 py-2">
          {Object.values(UserRole).map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="isActive" type="checkbox" defaultChecked={user.isActive} />
          Active
        </label>
        <input name="password" type="password" placeholder="Mật khẩu mới (để trống nếu giữ nguyên)" className="rounded border px-3 py-2" />
        <button className="rounded bg-espresso px-4 py-2 text-crema">Cập nhật</button>
      </form>
    </PageShell>
  );
}
