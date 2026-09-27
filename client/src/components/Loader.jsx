export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-accent-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
