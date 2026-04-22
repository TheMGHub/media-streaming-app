export function LoadingSpinner({ label = "Loading video..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
      <span>{label}</span>
    </div>
  );
}
