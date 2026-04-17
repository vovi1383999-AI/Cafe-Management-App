import { ReactNode } from 'react';

export function PageShell({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-espresso">{title}</h1>
      </header>
      <div className="rounded-lg bg-white p-4 shadow-sm">{children ?? <p>Coming soon...</p>}</div>
    </section>
  );
}
