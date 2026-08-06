import { prisma } from "../../lib/prisma"; 
import { AppError } from "../../util/app-erro";
import httpStatus from "http-status";
import { createReviewInput } from "./review.inputzodvalidation";

export const creatReviewDb = async (
  payload: createReviewInput,
  tenantId: string
) => {
  const { id, rating, comment } = payload;

  const rentdata = await prisma.rentalRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!rentdata) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found!");
  }

  if (rentdata.status !== "CONFIRMED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only leave a review for confirmed rentals!"
    );
  }

  if (rentdata.tenantId !== tenantId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to review this property!"
    );
  }

 
  const result = await prisma.review.create({
    data: {
      rating,
      comment,
      rentalRequestId: id,
      tenantId: tenantId,
      propertyId: rentdata.propertyId, // রেন্টাল রিকোয়েস্ট থেকে propertyId পাওয়া যাবে
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};