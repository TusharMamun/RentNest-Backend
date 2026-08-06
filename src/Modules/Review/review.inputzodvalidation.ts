import z from "zod";

export const updateReviewValidationSchema = z.object({
id: z.uuid("Invalid Property ID format"),
    rating: z
      .number(
       "Rating is required",
      )
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1 star")
      .max(5, "Rating cannot exceed 5 stars"),
    comment: z
      .string()
      .max(1000, "Comment cannot exceed 1000 characters")
      .optional()
});


  export type createReviewInput = z.infer<typeof updateReviewValidationSchema>;