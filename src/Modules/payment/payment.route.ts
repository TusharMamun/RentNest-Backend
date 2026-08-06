import { Router } from "express";
import { auth } from "../../Middleware/authguard";
import { Role } from "../../../generated/prisma/enums";
import { checkout, getAllPaymentController, getSinglePaymentDetails } from "./payment.controller";

const paymentRouter =Router()
paymentRouter.post("/checkout",auth(Role.ADMIN,Role.TENANT),checkout)
paymentRouter.get("/getAllpaymnet",auth(Role.ADMIN),getAllPaymentController)
paymentRouter.get("/:id",auth(Role.ADMIN),getSinglePaymentDetails)
export default paymentRouter