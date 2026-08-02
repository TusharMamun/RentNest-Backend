import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from 'http-status';
export const catchAsync=(fn:RequestHandler)=>{
return async(req:Request,res:Response,next:NextFunction)=>{
  try {
    await fn(req,res,next)
  } catch (error: any) {
    // ডাটাবেজ বা অন্য কোনো ইন্টারনাল এরর হলে তা হ্যান্ডেল করা
   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Something went wrong during registration.",
      error: error.message
    });
  }
}
}