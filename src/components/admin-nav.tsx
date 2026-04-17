import Link from 'next/link';

const links = [
  ['/dashboard', 'Dashboard'],
  ['/tables', 'Tables'],
  ['/orders', 'Orders'],
  ['/menu/categories', 'Menu Categories'],
  ['/menu/items', 'Menu Items'],
  ['/payments', 'Payments'],
  ['/inventory', 'Inventory'],
  ['/inventory/transactions', 'Stock Txn'],
  ['/shifts', 'Shifts'],
  ['/users', 'Users'],
  ['/reports', 'Reports']
] as const;

export function AdminNav() {
  return (
    <aside className="min-h-screen w-64 space-y-2 bg-espresso p-4 text-crema">
      <h2 className="mb-4 text-xl font-bold">Cafe Ops</h2>
      <nav className="flex flex-col gap-1">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="rounded px-3 py-2 hover:bg-white/10">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
