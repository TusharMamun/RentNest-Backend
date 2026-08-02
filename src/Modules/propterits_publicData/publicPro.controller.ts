import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { IPropertyQueryFilters } from "../Landlord_Management/Properties.interface";
import { publicProService } from "./publicPro.service";
const getAllPropertise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as unknown as IPropertyQueryFilters;
const result = await publicProService.getAllPropertisFromDb(query)




sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"Propertis Retrive success fully",
  data:result
})
  }
);

const categoryGet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await publicProService.catagorygetFromDb();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully!",
      data: result,
    });
  }
);
const singleProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;

    if (!propertyId) {
      throw new Error("Property ID is required!");
    }

    const result = await publicProService.getProptertyById(propertyId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property retrieved successfully!",
      data: result,
    });
  }
);

export const publicPro_controller={
    getAllPropertise,categoryGet,singleProperty
}