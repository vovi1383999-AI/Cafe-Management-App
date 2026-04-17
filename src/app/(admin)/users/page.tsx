import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { prisma } from '@/lib/db';

export default async function UsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <PageShell title="Người dùng">
      <div className="mb-4"><Link href="/users/new" className="rounded bg-espresso px-3 py-2 text-sm text-crema">+ Tạo người dùng</Link></div>
      <table className="w-full text-sm">
        <thead><tr><th>Họ tên</th><th>Email</th><th>Role</th><th></th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td>{user.fullName}</td><td>{user.email}</td><td>{user.role}</td>
              <td><Link className="text-blue-700" href={`/users/${user.id}/edit`}>Sửa</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
