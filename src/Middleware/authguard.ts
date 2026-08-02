import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../util/catchAsync";
import { jwtUtils } from "../util/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { ActiveStatus, Role } from "../../generated/prisma/enums";
import httpStatus from 'http-status'; 
import { prisma } from "../lib/prisma";



declare global{
    namespace Express{
        interface Request{
user?:{
   email:string,
   name:string,
   id:string,
   role:Role 
}
        }
    }
}
export const auth = (...requerdRole:Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.accessToken ?req.cookies?.accessToken:
      authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader

if (!token) {
      throw new Error("You are not logged in. Please log in to access this resource.");
    }
const verifiedToken =jwtUtils.veryfyedToken(token,config.jwt_access_secret)
if(!verifiedToken.success){
throw new Error(verifiedToken.error)
}
const {email,name,id,role} = verifiedToken.data as JwtPayload;
if(requerdRole.length&&!requerdRole.includes(role)){
throw new Error("Forbidden .You don't have permission to access this Resource")

}
const user = await prisma.user.findUnique({
    where:{
        id,
        email,
        name,
        role
    }

})
if(!user){
    throw new Error("User not found. Please log in Again.")
}
if (user.isAvailable!==ActiveStatus.ACTIVE) {
  throw new Error("Your account is not active. Please contact support.");
}

req.user={
    email,
    name,
    id,
    role
}
    next();
  });
};