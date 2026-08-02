import { Router } from "express";
import { publicPro_controller } from "./publicPro.controller";

const route = Router()
route.get("/properties",publicPro_controller.getAllPropertise)
route.get("/properties/:id",publicPro_controller.singleProperty)



route.get("/categories",publicPro_controller.categoryGet)

export const publicPropertisroute=route