const BudgetCategoryCard = ({ title }: { title: string }) => {
  return (
    <>
      <style>
        {`
          @keyframes tiles {
            0%, 40%, 80% {
              opacity: 0;
            }
            20%, 60% {
              opacity: 1;
            }
          }
        `}
      </style>
      <div className="relative flex w-full flex-col items-center justify-center text-center overflow-hidden rounded-xl border border-neutral-400/20 px-8 py-6 shadow-2xs dark:shadow-black">
        <DecorativeTilesBackground />
        <h3 className="z-20 text-xl text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
      </div>
    </>
  );
};

const DecorativeTilesBackground = () => {
  const animationDuration = 14;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 grid grid-rows-[repeat(auto-fill,16px)] grid-cols-[repeat(auto-fill,15px)]"
    >
      {Array.from({ length: 600 }).map((_, i) => {
        const delay = Math.random() * animationDuration;
        return (
          <div
            key={`tile-${i}`}
            className="relative h-[16px] w-[15px] border-r border-b border-dashed border-neutral-500/20"
          >
            <div
              className="h-[16px] w-[15px] bg-sky-600/10 dark:bg-sky-400/15"
              style={{
                opacity: 0,
                animationName: "tiles",
                animationIterationCount: "infinite",
                animationTimingFunction: "ease",
                animationDelay: `${delay}s`,
                animationDuration: `${animationDuration}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BudgetCategoryCard;
