import { AvailabilityStatus, RequestStatus } from "../../../generated/prisma/enums";

export interface ICreatePropertyPayload {
  title: string;
  description: string;
  location: string;
  pricePerMonth: number;
  amenities: string[];
  isAvailable?: AvailabilityStatus;
  catagoyName?: string;
}

export interface IUpdatePalyload {
  title?: string;
  description?: string;
  location?: string;
  pricePerMonth?: number;
  isAvailable?: AvailabilityStatus;
  catagoyName?: string;
}

export interface IPropertyQueryFilters {
  searchTerm?: string;
  location?: string;
  catagoyName?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  amenities?: string | string[];
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
export interface IUpdatePalyloadstatus {
status:RequestStatus
}