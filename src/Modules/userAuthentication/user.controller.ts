import { NextFunction, Request, RequestHandler, Response } from "express";

import httpStatus from 'http-status';
import { userAuthService } from "./user.service";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";


const userRegesterController=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body
   const user = await userAuthService.regesterService(payload)


sendResponse(res,{
  success:true,
  statusCode:httpStatus.CREATED,
  message:"User Regesterd Successfully",
  data:{user}
})
})
const getProfile=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

const profile = await userAuthService.getProfile(req.user?.id as string)
sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"User Profile Fetch Scucessfully",
  data:{profile}
})
})
const userUpdateUser=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const userId = req.user?.id as string
  const payload = req.body
  const result =await userAuthService.upadteUser(userId,payload)
  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"User Profile updated SuccessFully",
    data:{result}
  })

})


export const  usrAuthController = {
    userRegesterController,
    getProfile,
  userUpdateUser
}