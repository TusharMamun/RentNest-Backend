import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../Middleware/authguard";
import { Role } from "../../../generated/prisma/enums";

const router = Router()
router.post('/create-checkout-session',auth(Role.ADMIN,Role.TENANT),paymentController.createCheckoutSession)
export const paymnetRoutes = router