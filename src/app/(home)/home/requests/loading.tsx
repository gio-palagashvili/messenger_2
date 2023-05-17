import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const loading: FC = ({}) => {
  return (
    <SkeletonTheme baseColor="#191D23" highlightColor="#2B303C">
      <div className="w-[60%] m-auto h-[80%]">
        <h1 className="text-3xl">
          <Skeleton className="mb-4" height={30} width={220} />
        </h1>
        <div className="skeloLG">
          <Skeleton height={80} className="rounded-full" width={1150} />
        </div>
        <div className="skeloMD">
          <Skeleton height={80} className="rounded-full" width={550} />
        </div>
        <div className="skeloSM">
          <Skeleton height={80} className="rounded-full" width={350} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default loading;
