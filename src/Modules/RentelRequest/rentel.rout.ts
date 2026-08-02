import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../Middleware/authguard";
import { rentelRequestController } from "./rentel.controller";

const router = Router();

// Create rental request (TENANT or ADMIN)
router.post("/rentals", auth(Role.TENANT, Role.ADMIN), rentelRequestController.creatRentelRequest);

// Get my rental requests (TENANT)
router.get("/rentals/my", auth(Role.TENANT, Role.ADMIN,Role.LANDLORD), rentelRequestController.getMyRentelRequest);

// Get all rental requests (ADMIN only)
router.get("/rentals", auth(Role.ADMIN,Role.TENANT), rentelRequestController.getAllRentelRequest);
router.get("/rentals/:id", auth(Role.ADMIN,Role.TENANT), rentelRequestController.getsingleData);

export const rentelRequestRout = router;
