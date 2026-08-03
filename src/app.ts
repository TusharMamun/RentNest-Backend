import cookieParser from "cookie-parser";
import cors from "cors";
import express, { application, Application } from "express";
import config from "./config";
import { authRouter } from "./Modules/Auth/auth.routes";
import { propertiesRout } from "./Modules/Landlord_Management/properties.route";
import { publicPropertisroute } from "./Modules/propterits_publicData/publicPro.route";
import { rentelRequestRout } from "./Modules/RentelRequest/rentel.rout";
import { userAuthRouter } from "./Modules/userAuthentication/user.route";
import { adminRouter } from "./Modules/Admin/admin.route";
import { paymnetRoutes } from "./Modules/payment/payment.route";
import { notFound } from "./Middleware/not-founds";
import { globalErrorHandler } from "./Middleware/global_error";



const app: Application = express();

// Middleware — order matters: CORS first, then body parsers

app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" })

);

app.use(cors({
    origin: config.app_url,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth user Api Route
// app.post("/api/auth/register", );
app.use("/api/auth",userAuthRouter)
app.use("/api/auth",authRouter)
app.use("/api/landlord",propertiesRout)
app.use("/api",publicPropertisroute)
app.use("/api",rentelRequestRout)
app.use("/api/admin",adminRouter)
app.use("/api/payment",paymnetRoutes)



app.use(notFound)
app.use(globalErrorHandler)
export default app;

 