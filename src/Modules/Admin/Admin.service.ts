import { USTATUS } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IPropertyQueryFilters } from "../Landlord_Management/Properties.interface";
import { IupdateUserPayload } from "./Admin.interface";
import { Prisma } from "../../../generated/prisma/client";
const getAllUser = async (userId: string) => {

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });


  if (!currentUser) {
    throw new Error("User not found!");
  }

  if (currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized access! Only admins can perform this action.");
  }

  
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isAvailable: true,
      userStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return allUsers;
};
const updateuserStatusfromDb = async(userId:string,payload:IupdateUserPayload)=>{

  const isExist = await prisma.user.findUnique({
    where: { id:userId },
  });

  if (!isExist) {
    throw new Error("Rental request not found!");
  }

  const result = await prisma.user.update({
    where: {id:userId },
    data: { 
      userStatus: payload.userStatus
    },
    omit:{
      password:true
    }
  });
    return result;
}
const getAllPropertisFromDb = async () => {
  const result = await prisma.property.findMany({
    include: {
      catagory: true,
    },
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
export const AdminData = {
  getAllUser,
  updateuserStatusfromDb,
getAllPropertisFromDb,
getAllRentelReqService


};