import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

const ReviewList = ({ productId }: Props) => {
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const fetchReviews = async () => {
      try {
         setIsLoading(true);
         const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(data);
         setIsLoading(false);
      } catch (error) {
         console.error(error);
         setError('Could not fetch reviews. Try again later.');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={7} />
                  <Skeleton width={80} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return <div className="text-red-500">{error}</div>;
   }

   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>
                  <StarRating value={review.rating} />
               </div>
               <p className="py-2">{review.content}</p>
               <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
         ))}
         {reviewData?.reviews.length === 0 && <p>No reviews available.</p>}
      </div>
   );
};

export default ReviewList;
