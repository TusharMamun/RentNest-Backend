import { AvailabilityStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../util/app-erro";
import { IRentalRequest } from "./retntel.interface";

import httpStatus from "http-status";

const creatRentelReqService = async (userId: string,payload: IRentalRequest, ) => {


  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });


//   await prisma.property.findUniqueOrThrow({
//     where: { id: payload.propertyId },
//   });
const propertyidget=await prisma.property.findUnique({
    where:{
        id:payload.propertyId
    }
})
if(!propertyidget){
throw new AppError(httpStatus.NOT_FOUND, "can't find property id")
}

if (propertyidget.isAvailable !== AvailabilityStatus.AVAILABLE) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Property is not available for rental request!"
  );
}
if (propertyidget.landlordId === userId) {
  throw new AppError(
    httpStatus.FORBIDDEN, 
    "You cannot rent your own property!"
  );
}
const overlapping = await prisma.rentalRequest.findFirst({
  where: {
    propertyId: propertyidget.id,
    status: {
      not: "REJECTED",
    },
    // Existing booking starts BEFORE the new request ends
    startDate: {
      lt: payload.endDate,
    },
    // Existing booking ends AFTER the new request starts
    endDate: {
      gt: payload.startDate,
    },
  },
});

if (overlapping) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Property is already booked for these selected dates!"
  );
}

  const result = await prisma.rentalRequest.create({
    data: {
      startDate: payload.startDate,
      endDate: payload.endDate,
      tenantId: userId,
      propertyId: payload.propertyId,
    totalPrice:propertyidget.pricePerMonth
    },
    include: {
      tenant: {
        omit: { password: true },
      },
      property: true,
    },
  });

  return result;
};

const getMyRentelReqService = async (userId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: { tenantId: userId },
    include: {
      property: {
        include: { catagory: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getAllRentelReqService = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        omit: { password: true },
      },
      property: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};
const getsingle = async (id:string) => {
  const result = await prisma.rentalRequest.findMany({
    where: { id:id },
    include: {
      property: {
        include: { catagory: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};
export const rentelService = {
  creatRentelReqService,
  getMyRentelReqService,
  getAllRentelReqService,
  getsingle
};