import { Router } from "express";
import { adminController } from "./Admin.controller";
import { auth } from "../../Middleware/authguard";
import { Role } from "../../../generated/prisma/enums";

const route = Router()
route.get("/users",auth(Role.ADMIN),adminController.allUser)
route.patch("/users/:id",auth(Role.ADMIN),adminController.updateUser)
route.get("/properties",auth(Role.ADMIN),adminController.getAllPropertise)
route.get("/rentals",auth(Role.ADMIN),adminController.getAllRentelRequest)







export const adminRouter = route