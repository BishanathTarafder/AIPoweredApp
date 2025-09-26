import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';
import { HiSparkles } from 'react-icons/hi2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

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

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const {
      mutate: handleSummarize,
      isPending: isSummarizing,
      isError: isSummaryError,
      data: summarizeResponse,
   } = useMutation<SummarizeResponse>({
      mutationFn: async () => summarizeReviews(),
   });

   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <p className="text-red-500">Could not fetch reviews. Try again!</p>
      );
   }

   if (reviewData?.reviews.length === 0) {
      return <p>No reviews available.</p>;
   }

   const displayedSummary = summarizeResponse?.summary || reviewData?.summary;

   return (
      <div>
         <div className="mb-5">
            <h2 className="text-2xl font-bold mb-2">Reviews</h2>
            {displayedSummary ? (
               <div className="p-4 bg-gray-100 rounded">{displayedSummary}</div>
            ) : (
               <div>
                  <Button
                     onClick={() => handleSummarize()}
                     className="cursor-pointer"
                     disabled={isSummarizing}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {isSummarizing && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {isSummaryError && (
                     <p className="text-red-500 mt-2">
                        Could not summarize reviews. Try again!
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
                  <small>
                     {new Date(review.createdAt).toLocaleDateString()}
                  </small>
               </div>
            ))}
            {reviewData?.reviews.length === 0 && <p>No reviews available.</p>}
         </div>
      </div>
   );
};

export default ReviewList;
