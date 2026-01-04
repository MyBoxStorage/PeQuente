import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="aspect-square bg-[#252525]">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
