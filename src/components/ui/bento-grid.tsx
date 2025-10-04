import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 auto-rows-[16rem] sm:auto-rows-[18rem] md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col space-y-4 rounded-xl border border-white/[0.2] bg-black p-4 sm:p-6 transition duration-200 hover:shadow-xl shadow-none relative",
        className,
      )}
    >
      <div className="flex flex-col space-y-3 sm:space-y-4 h-full">
        {/* Title at the top - centered and larger */}
        <div className="text-center">
          <div className="font-sans text-2xl sm:text-3xl font-bold text-white leading-tight">
            {title}
          </div>
        </div>
        
        {/* Header/Visual content */}
        <div className="flex-1">
          {header}
        </div>
        
        {/* Description at the bottom */}
        <div className="font-sans text-xs sm:text-sm font-normal text-gray-400 text-center">
          {description}
        </div>
      </div>
    </div>
  );
};

