import Skeleton from 'react-loading-skeleton';

const ReviewSkeleton = () => {
   return (
      <div>
         <Skeleton width={150} />
         <Skeleton width={100} />
         <Skeleton count={7} />
         <Skeleton width={80} />
      </div>
   );
};

export default ReviewSkeleton;
