import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../util/app-erro";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { error } from "node:console";
import { PrismaClientValidationError } from "../../generated/prisma/internal/prismaNamespace";
import config from "../config";

export const GlobelErrorHendeler:ErrorRequestHandler=(err,req,res,next)=>{
let statusCode = 500;
let message="Something Went Wrong";
let errorDetails:unknown=null;

if(err instanceof ZodError){
    statusCode=400,
    message="Validation Error"
}else if(err instanceof AppError){
statusCode=err.statusCode;
message=err.message
errorDetails=err.errorDetails ?? null
}
else if(err instanceof PrismaClientKnownRequestError){
switch (err.code) {
      case "P2002":
        // Unique constraint violation (e.g. duplicate email)
        statusCode = 409;
        const target = (err.meta?.target as string[])?.join(", ") || "field";
        message = `Unique constraint failed: A record with this ${target} already exists.`;
        break;

      case "P2025":
        // Record to update/delete does not exist
        statusCode = 404;
        message = (err.meta?.cause as string) || "Record to update or delete was not found.";
        break;

      case "P2003":
        // Foreign key constraint failure (e.g. invalid categoryId)
        statusCode = 400;
        const fieldName = (err.meta?.field_name as string) || "foreign key";
        message = `Foreign key constraint failed on field: ${fieldName}`;
        break;

      case "P2014":
        // Required relation violation
        statusCode = 400;
        message = "The change you are trying to make would violate a required relation.";
        break;

      default:
        // Other Prisma runtime errors
        statusCode = 400;
        message = `Database Error [Code ${err.code}]`;
        break;
    }
}
else if(error instanceof PrismaClientValidationError){
statusCode=400;
message = "Invalid query or database validation failed";
}
if(statusCode ===500 && config.NOde){

}

}