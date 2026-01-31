import { Skeleton } from "@/components/ui/skeleton";

const CharacterDetailSkeleton = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Character + Stroke Animation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-soft">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Stroke animation placeholder */}
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="w-37.5 h-37.5 rounded-lg" />
                  {/* Decomposition placeholder */}
                  <Skeleton className="h-5 w-24" />
                </div>

                {/* Character info */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    {/* Character and pinyin */}
                    <Skeleton className="h-8 w-32" />
                    {/* Component tiles */}
                    <div className="flex gap-2">
                      <Skeleton className="w-12 h-16 rounded-lg" />
                      <Skeleton className="w-12 h-16 rounded-lg" />
                    </div>
                  </div>
                  {/* Meaning */}
                  <Skeleton className="h-7 w-48" />
                  {/* Etymology hint */}
                  <Skeleton className="h-6 w-64" />
                  {/* Frequency badge */}
                  <div className="flex gap-2 justify-center md:justify-start mt-4">
                    <Skeleton className="h-7 w-28 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notes Section */}
        <div className="h-full">
          <div className="h-full p-6 rounded-xl bg-white border border-gray-200 flex flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="flex-1 min-h-30" />
          </div>
        </div>
      </div>

      {/* Character Grid Skeletons */}
      <CharacterGridSkeleton />
      <CharacterGridSkeleton />
      <CharacterGridSkeleton />
    </div>
  );
};

const CharacterGridSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-16 h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default CharacterDetailSkeleton;
