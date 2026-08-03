import { ActiveStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import { ILogingUser } from "./auth.interface"
import bcrypt from 'bcrypt';
import  Jwt, { JwtPayload, SignOptions }   from "jsonwebtoken";
import { jwtUtils } from "../../util/jwt";

import httpStatus from "http-status";
import { AppError } from "../../util/app-erro";

const loginguser=async(payload:ILogingUser)=>{
const {email,password} = payload
const user =await prisma.user.findUniqueOrThrow({
    where:{email},

}
)
console.log(user)
if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User not found. Please log in Again.");
}
if (user.isAvailable !==ActiveStatus.ACTIVE) {
  throw new AppError(httpStatus.FORBIDDEN, "Your account is not active. Please contact support.");
}
console.log(user.isAvailable)

const isPasswordMetched = await bcrypt.compare(password,user.password);
if(!isPasswordMetched){
    throw new AppError(httpStatus.UNAUTHORIZED, "password is incorrect");
}
const jwtPayload = {
        id:user.id,
    name:user.name,
    email:user.email,
    role:user.role
}
const accessToken =Jwt.sign(
  jwtPayload, 
  config.jwt_access_secret, 
  { expiresIn: (config.jwt_access_expires_in) as SignOptions['expiresIn'] }
);


const refreshToken = Jwt.sign(
  jwtPayload, 
  config.jwt_refresh_secret, 
  { expiresIn: (config.jwt_refresh_expires_in ) as SignOptions['expiresIn'] }
);
return {
    accessToken,refreshToken
}
}
const refreshToken=async(refreshToken:string)=>{
const verfyedRefreshToken = jwtUtils.veryfyedToken(refreshToken,config.jwt_refresh_secret)
if(!verfyedRefreshToken.success){
   throw new AppError(httpStatus.UNAUTHORIZED, verfyedRefreshToken.error || "Invalid or expired refresh token."); 
}
const {id}=verfyedRefreshToken.data as JwtPayload
const user=await prisma.user.findUnique({
    where:{
        id
    }
})
if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User not found. Please log in Again.");
}
if (user.isAvailable !==ActiveStatus.ACTIVE) {
  throw new AppError(httpStatus.FORBIDDEN, "Your account is not active. Please contact support.");
}
const jwtPayload={                         
    id,
    name:user.name,
    email:user.email,
    role:user.role

}
const accessToken=jwtUtils.creatToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
)
return {accessToken}
}
export const authService={
    loginguser,
    refreshToken
    
}