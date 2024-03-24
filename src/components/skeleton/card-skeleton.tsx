import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[100px] w-[400px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[400px]" />
        </div>
      </div>
    </>
  );
}
