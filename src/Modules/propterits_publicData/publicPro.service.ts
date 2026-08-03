import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../util/app-erro";
import { IPropertyQueryFilters } from "../Landlord_Management/Properties.interface";

import httpStatus from "http-status";

const getAllPropertisFromDb = async (query: IPropertyQueryFilters) => {
  const { searchTerm, location, catagoyName, minPrice, maxPrice, amenities } = query;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  // 🔍 ১. Search Term — title, location, description
  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // 📍 ২. Location
  if (location) {
    andConditions.push({
      location: { contains: location, mode: "insensitive" },
    });
  }


  if (catagoyName) {
    andConditions.push({
      catagory: {
        is: {
          catagoryName: { contains: catagoyName.trim(), mode: "insensitive" },
        },
      },
    });
  }

  // 💰 ৪. Price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    andConditions.push({
      pricePerMonth: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    });
  }

  // 🛋️ ৫. Amenities — hasSome: at least one must match
  if (amenities) {
    const amenitiesList = Array.isArray(amenities)
      ? amenities
      : amenities.split(",").map((a) => a.trim()).filter(Boolean);

    if (amenitiesList.length > 0) {
      andConditions.push({
        amenities: { hasSome: amenitiesList },
      });
    }
  }

  const result = await prisma.property.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      catagory: true,
    },
  });

  return result;
};

const catagorygetFromDb = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getProptertyById = async (propertyId: string) => {
  const result = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      catagory: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found with the provided ID!");
  }

  return result;
};

export const publicProService = {
  getAllPropertisFromDb,
  catagorygetFromDb,
  getProptertyById,
};