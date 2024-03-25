import { Skeleton } from "@/components/ui/skeleton";

export function GithubRepoCardSkeleton() {
  return (
    <>
      <div className="flex-col p-6 grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <h3 className="leading-none tracking-tight">
            <Skeleton className="w-[136px] max-w-full" />
          </h3>
          <p className="pt-1">
            <Skeleton className="w-[792px] max-w-full" />
          </p>
        </div>
        <div className="flex items-center space-x-0">
          <div className="inline-flex items-center justify-center transition-colors h-10 py-2 px-3 shadow-none">
            <Skeleton className="w-[48px] max-w-full" />
          </div>
          <div className="shrink-0 bg-border w-[1px] h-[20px]"></div>
          <div className="inline-flex items-center justify-center transition-colors h-10 py-2 px-1 shadow-none">
          </div>
        </div>
      </div>
    </>
  );
};

