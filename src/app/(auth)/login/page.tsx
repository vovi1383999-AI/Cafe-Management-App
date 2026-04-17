import { APP_ROUTES } from '@/lib/constants';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Đăng nhập hệ thống</h1>
        <form action="/api/auth/login" method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" required className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Mật khẩu</label>
            <input id="password" name="password" type="password" required className="w-full rounded border px-3 py-2" />
          </div>
          <button className="w-full rounded bg-espresso px-4 py-2 font-medium text-crema" type="submit">
            Đăng nhập
          </button>
        </form>
        <p className="mt-4 text-sm text-stone-600">Mặc định: admin@cafe.local / 123456. Sau đăng nhập sẽ về {APP_ROUTES.dashboard}.</p>
      </div>
    </main>
  );
}
