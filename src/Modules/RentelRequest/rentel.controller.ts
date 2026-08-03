import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { rentelService } from "./rentel.service";

const creatRentelRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
   
    console.log(req.body)


    const result = await rentelService.creatRentelReqService(
      tenantId as string,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental request created successfully!",
      data: result,
    });
  }
);

const getMyRentelRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;

    const result = await rentelService.getMyRentelReqService(tenantId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully!",
      data: result,
    });
  }
);
const getsingleData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const result = await rentelService.getsingle(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully!",
      data: result,
    });
  }
);

const getAllRentelRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentelService.getAllRentelReqService();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental requests retrieved successfully!",
      data: result,
    });
  }
);

export const rentelRequestController = {
  creatRentelRequest,
  getMyRentelRequest,
  getAllRentelRequest,
  getsingleData
};
