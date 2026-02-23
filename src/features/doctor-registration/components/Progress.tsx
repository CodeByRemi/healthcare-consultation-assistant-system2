export default function ProgressBar() {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-primary text-sm font-bold uppercase">
          Step 1 of 3
        </span>
        <span className="font-medium">Professional Credentials</span>
      </div>

      <div className="h-1.5 bg-surface-dark border border-border-dark rounded-full">
        <div className="h-full w-1/3 bg-primary rounded-full" />
      </div>
    </div>
  );
}
