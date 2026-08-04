import { RequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../util/app-erro";
import { ICreatePropertyPayload, IUpdatePalyload, IUpdatePalyloadstatus } from "./Properties.interface";

import httpStatus from "http-status";

const creatPropterisDb = async (
  payload: ICreatePropertyPayload,
  userId: string
) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Landlord account not found!");
  }


  const { catagoyName, ...propertyFields } = payload;

  // ৩. categoryId রিজল্ভ করা — catagoyName দিলে সেই ক্যাটাগরি খোঁজা বা তৈরি করা
  let categoryId: string | undefined = undefined;

  if (catagoyName) {
    const trimmedName = catagoyName.trim();

    const existingCategory = await prisma.category.findFirst({
      where: { catagoryName: { equals: trimmedName, mode: "insensitive" } },
    });

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const newCategory = await prisma.category.create({
        data: {
          catagoryName: trimmedName,
          userId,
        },
      });
      categoryId = newCategory.id;
    }
  }

  // ৪. ডাটাবেজে প্রোপার্টি ক্রিয়েট করা
  const result = await prisma.property.create({
    data: {
      ...propertyFields,
      landlordId: userId,
      ...(categoryId && { categoryId }),
    },
  });

  return result;
};

const getAllPropertisFromDb = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      catagory: true,
    },
  });
 
  return result;
};
const updatedPropetisDb = async (propertiesId: string, payload: IUpdatePalyload) => {
  await prisma.property.findUniqueOrThrow({
    where: { id: propertiesId },
  });

  const result = await prisma.property.update({
    where: { id: propertiesId },
    data: payload,
    include: {
      landlord: {
        omit: { password: true },
      },
      catagory: true,
    },
  });
  return result;
};

const deletedPropertisfromDb = async (propertiesId: string) => {
  await prisma.property.findUniqueOrThrow({
    where: { id: propertiesId },
  });

  await prisma.property.delete({
    where: { id: propertiesId },
  });
  return null;
};


const getProptertyById = async (propertyId: string) => {
  const result = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      catagory: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found with the provided ID!");
  }

  return result;
};





const catagorygetFromDb= async()=>{
const result = await prisma.category.findMany()
return result
}

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
const updateStatusInDb = async (
  id: string, 
  payload: IUpdatePalyloadstatus
) => {
console.log(id)
  const isExist = await prisma.rentalRequest.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found!");
  }

  const result = await prisma.rentalRequest.update({
    where: { id },
    data: { 
      status: payload.status 
    }
  });

  return result;
};



export const propertisService = {
  creatPropterisDb,
  getAllPropertisFromDb,
  getProptertyById,
  catagorygetFromDb,
  updatedPropetisDb,
  deletedPropertisfromDb,
  getAllRentelReqService,
  updateStatusInDb
};