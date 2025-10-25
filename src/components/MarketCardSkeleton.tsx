import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const MarketCardSkeleton = () => {
  return (
    <Card className="p-6 space-y-4 glass-card">
      <div className="space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex items-center justify-center py-6">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 py-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 mx-auto" />
          <Skeleton className="h-6 w-16 mx-auto" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 mx-auto" />
          <Skeleton className="h-6 w-16 mx-auto" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
};
