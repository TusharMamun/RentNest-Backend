import { Router } from "express";
import { auth } from "../../Middleware/authguard";
import { Role } from "../../../generated/prisma/enums";
import { creatReview } from "./review.controller";

const route =Router()
route.post("/reviews",auth(Role.ADMIN,Role.TENANT),creatReview)

export const  reviewRouter = route