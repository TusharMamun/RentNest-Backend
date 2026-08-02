import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

// Note: Depending on your Prisma version, you can also import directly from '@prisma/client'

import config from "../config";
import { AppError } from "../util/app-erro";
import { PrismaClientValidationError } from "../../generated/prisma/internal/prismaNamespace";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = "Something Went Wrong";
  let errorDetails: unknown = null;

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.issues;
  } 
  // 2. Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.errorDetails ?? null;
  } 
  // 3. Prisma Known Request Errors
  else if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = 409; // Conflict
        const target = (err.meta?.target as string[])?.join(", ") || "field";
        message = `Unique constraint failed: A record with this ${target} already exists.`;
        break;
      }
      case "P2025": {
        statusCode = 404; // Not Found
        message = (err.meta?.cause as string) || "Record to update or delete was not found.";
        break;
      }
      case "P2003": {
        statusCode = 400; // Bad Request
        const fieldName = (err.meta?.field_name as string) || "foreign key";
        message = `Foreign key constraint failed on field: ${fieldName}`;
        break;
      }
      case "P2014": {
        statusCode = 400;
        message = "The change you are trying to make would violate a required relation.";
        break;
      }
      default: {
        statusCode = 400;
        message = `Database Error [Code ${err.code}]`;
        break;
      }
    }
    errorDetails = { code: err.code, meta: err.meta };
  } 
  // 4. Prisma Validation Errors
  else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid query or database validation failed";
  }

  // Handle stack traces for generic errors during development
  if (config.node_env !== "production") {
    if (errorDetails === null && err instanceof Error) {
      errorDetails = { stack: err.stack };
    }
  } else if (statusCode === 500) {
    // Hide details in production for internal server errors
    errorDetails = null;
  }

  // Send formatted JSON response
  res.status(statusCode).json({
    success: false,
  message,errorDetails
  });
};