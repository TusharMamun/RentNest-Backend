import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./retntel.interface";

const creatRentelReqService = async (userId: string,payload: IRentalRequest, ) => {

console.log(payload)
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
throw new Error("can't find property id")
}


  const result = await prisma.rentalRequest.create({
    data: {
      startDate: payload.startDate,
      endDate: payload.endDate,
      tenantId: userId,
      propertyId: payload.propertyId,
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
