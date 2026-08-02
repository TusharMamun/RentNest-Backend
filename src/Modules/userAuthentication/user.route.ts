import { NextFunction, Request, Response, Router } from "express";
import { usrAuthController } from "./user.controller";
import { jwtUtils } from "../../util/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../../Middleware/authguard";


const route = Router()

route.post("/register",usrAuthController.userRegesterController)
route.get("/me",auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),   usrAuthController.getProfile)
route.put("/update_myprofile",auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),usrAuthController.userUpdateUser)
    
    
    
    




export const userAuthRouter = route