const NoteCardSkeleton = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white animate-pulse">
        <div className="w-10 h-10 rounded bg-gray-200" />
        <div className="w-12 h-3 rounded bg-gray-200" />
        <div className="w-16 h-3 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-200" />
        <div className="space-y-2">
          <div className="w-20 h-4 rounded bg-gray-200" />
          <div className="w-32 h-3 rounded bg-gray-200" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-16 h-6 rounded-md bg-gray-200" />
        <div className="w-20 h-6 rounded-md bg-gray-200" />
      </div>
    </div>
  );
};

export default NoteCardSkeleton;
