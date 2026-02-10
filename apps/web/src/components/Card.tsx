export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-100">
      {children}
    </div>
  );
}
