import { prisma } from "../../lib/prisma"; 
import { AppError } from "../../util/app-erro";
import httpStatus from "http-status";
import { createReviewInput } from "./review.inputzodvalidation";
import { ICreateReviewInput } from "./review.interface";

export const creatReviewDb = async (
  payload: ICreateReviewInput,
  tenantId: string
) => {
  const { rentelid, rating, comment } = payload;

  const rentdata = await prisma.rentalRequest.findUnique({
    where: {
      id: rentelid,
    },
    include:{
      tenant:true
    }
  });


  if (!rentdata) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found!");
  }

  // if (rentdata.status !== "CONFIRMED") {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "You can only leave a review for confirmed rentals!"
  //   );
  // }

  if (rentdata.tenant.id !== tenantId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to review this property!"
    );
  }

 
  const result = await prisma.review.create({
    data: {
      rating,
      comment,
      rentelRequestId: rentelid,
      tenantId: tenantId,
      propertyId: rentdata.propertyId, 
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