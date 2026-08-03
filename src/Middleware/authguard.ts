import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../util/catchAsync";
import { jwtUtils } from "../util/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { ActiveStatus, Role } from "../../generated/prisma/enums";
import httpStatus from 'http-status'; 
import { prisma } from "../lib/prisma";
import { AppError } from "../util/app-erro";


declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRole: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.accessToken
        ? req.cookies?.accessToken
        : authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    // 1. Missing Token
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED, // 401
        "You are not logged in. Please log in to access this resource."
      );
    }

    // 2. Token Verification Failed
    const verifiedToken = jwtUtils.veryfyedToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new AppError(
        httpStatus.UNAUTHORIZED, // 401
        verifiedToken.error || "Invalid or expired token. Please log in again."
      );
    }

    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    // 3. Role Authorization Failed
    if (requiredRole.length && !requiredRole.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN, // 403
        "Forbidden. You don't have permission to access this resource."
      );
    }

    // 4. User Existence Check
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role,
      },
    });

    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND, // 404
        "User not found. Please log in again."
      );
    }

    // 5. Account Status Check
    if (user.isAvailable !== ActiveStatus.ACTIVE) {
      throw new AppError(
        httpStatus.FORBIDDEN, // 403
        "Your account is not active. Please contact support."
      );
    }

    // Attach decoded user payload to request
    req.user = {
      email,
      name,
      id,
      role,
    };

    next();
  });
};