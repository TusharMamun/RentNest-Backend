import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { catchAsync } from "../../util/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../util/sendResponse";
import httpStatus from 'http-status';
import config from "../../config";
import { jwtUtils } from "../../util/jwt";
import { LoginInfoSchema } from "./AuthZodValidation";
const loginUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const payload =LoginInfoSchema.parse(req.body)
const {accessToken,refreshToken} = await authService.loginguser(payload)

res.cookie(
 "accessToken",accessToken,{
httpOnly:true,
secure:false,
sameSite:"none",
maxAge: 1000 * 60 * 60 * 24,
 }   
)
res.cookie(
 "refreshToken",refreshToken,{
httpOnly:true,
secure:false,
sameSite:"none",
maxAge: 1000 * 60 * 60 * 24 * 7,
 }   
)


sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"User Login Scuccess fully",
  data:{
    accessToken,refreshToken
  }
})
})
const refreshToken=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const refreshToken = req.cookies.refreshToken;
const {accessToken} =await authService.refreshToken(refreshToken)
res.cookie(
 "accessToken",accessToken,{
httpOnly:true,
secure:false,
sameSite:"none",
maxAge: 1000 * 60 * 60 * 24,
 }   
)
sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"Tokne Refreshed SuccesFully",
data:{accessToken}
})

})

export const authController={
loginUser,refreshToken

}