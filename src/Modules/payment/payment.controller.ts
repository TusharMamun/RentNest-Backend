import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { paymentdbservice } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const requestProperty = req.body;

    if (!tenantId) {
      throw new Error("Unauthorized access! Tenant ID missing.");
    }

    const result = await paymentdbservice.creatChakoutsession(
      tenantId,
      requestProperty
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Checkout session created successfully!",
      data: result,
    });
  }
);

export const paymentController = {
  createCheckoutSession,
};