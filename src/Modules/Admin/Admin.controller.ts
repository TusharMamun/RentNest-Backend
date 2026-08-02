import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"; // অথবা আপনার প্রজেক্টের status code constant
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse"; // আপনার প্রজেক্টের sendResponse Utility
import { AdminData } from "./Admin.service";
import { IPropertyQueryFilters } from "../Landlord_Management/Properties.interface";

const allUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Unauthorized access! User ID not found.");
    }


    const result = await AdminData.getAllUser(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully!",
      data: result,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 💡 req.params থেকে id ডিস্ট্রাকচার করে নেওয়া হলো
    const { id } = req.params; 
    const payloadData = req.body;

    if (!id) {
      throw new Error("User ID is required!");
    }

    const result = await AdminData.updateuserStatusfromDb(id as string, payloadData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User status updated successfully!", // 💡 সঠিক মেসেজ
      data: result,
    });
  }
);
const getAllPropertise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

const result = await AdminData.getAllPropertisFromDb()




sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"Propertis Retrive success fully",
  data:result
})
  }
);
const getAllRentelRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminData.getAllRentelReqService();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental requests retrieved successfully!",
      data: result,
    });
  }
);

export const adminController = {
  allUser,updateUser,getAllPropertise,getAllRentelRequest
};