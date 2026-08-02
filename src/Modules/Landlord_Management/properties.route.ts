import { Router } from "express";

import { auth } from "../../Middleware/authguard";
import { Role } from "../../../generated/prisma/enums";
import { propertiesController } from "./properties.controller";

const router  = Router()
export const propertiesRout = router
router.post("/properties",auth(Role.ADMIN,Role.LANDLORD),propertiesController.createProperty)
router.get("/properties",auth(Role.ADMIN,Role.LANDLORD),propertiesController.getAllPropertise)
router.get("/properties/:id",auth(Role.ADMIN,Role.LANDLORD),propertiesController.singleProperty)
router.put("/properties/:id",auth(Role.ADMIN,Role.LANDLORD),propertiesController.updatePropetis)
router.delete("/properties/:id",auth(Role.ADMIN,Role.LANDLORD),propertiesController.deletedPropertis)

router.get("/requests",auth(Role.ADMIN,Role.LANDLORD),propertiesController.getAllRentelRequest)
router.patch("/requests/:id",auth(Role.ADMIN,Role.LANDLORD),propertiesController.updateStatus)





router.get("/categories",auth(Role.ADMIN,Role.LANDLORD),propertiesController.categoryGet)