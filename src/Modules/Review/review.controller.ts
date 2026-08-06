import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"; // 👈 ইমপোর্ট মিসিং ছিল
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";

import { creatReviewDb } from "./review.service";
import { updateReviewValidationSchema } from "./review.inputzodvalidation";

export const creatReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Validate request body using CREATE schema
  const validatedData =updateReviewValidationSchema.parse(req.body)
  

  const tenantId = req.user?.id;


const result =await creatReviewDb(validatedData,tenantId as string)
  // 4. Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully!",
    data: result,
  });
});