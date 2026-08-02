import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { propertisService } from "./proterties.service";
import { prisma } from "../../lib/prisma";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Unauthorized! User ID is missing.");
    }

    // ২. সার্ভিস ডেকে প্রোপার্টি তৈরি করা
    const payload = req.body;
    const result = await propertisService.creatPropterisDb(payload, userId);

    // ৩. রেসপন্স সেন্ড করা
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully!",
      data: result,
    });
  }
);
const getAllPropertise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
const result = await propertisService.getAllPropertisFromDb()
sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"Propertis Retrive success fully",
  data:result
})
  }
);
const singleProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;

    if (!propertyId) {
      throw new Error("Property ID is required!");
    }

    const result = await propertisService.getProptertyById(propertyId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property retrieved successfully!",
      data: result,
    });
  }
);
const updatePropetis = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    // 👈 রুল চেক: role === 'ADMIN' হতে হবে
  
    const propertyId = req.params.id;
    const payload = req.body;

    if (!propertyId) {
      throw new Error("Property ID is required!");
    }


    const result = await propertisService.updatedPropetisDb(
      propertyId as string,
      payload,
  
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully!",
      data: result,
    });
  }
);
const deletedPropertis = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const propertyId = req.params.id;

    if (!propertyId) {
      throw new Error("Property ID is required!");
    }


    const result = await propertisService.deletedPropertisfromDb(
      propertyId as string,
   
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully!",
      data: result,
    });
  }
);



const categoryGet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await propertisService.catagorygetFromDb();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully!",
      data: result,
    });
  }
);
const getAllRentelRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
const result = await propertisService.getAllRentelReqService()

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental requests retrieved successfully!",
      data: result,
    });
  }
);

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body; 

    const result = await propertisService.updateStatusInDb(id as string, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request status updated successfully!",
      data: result,
    });
  }
);




export const propertiesController = {
  createProperty,
  getAllPropertise,
  singleProperty,
  categoryGet,
  updatePropetis,
  deletedPropertis,
  getAllRentelRequest,
  updateStatus
};