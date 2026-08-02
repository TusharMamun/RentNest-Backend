import { RequestStatus } from "../../../generated/prisma/enums";


export interface IRentalRequest {

  propertyId: string;
    startDate: Date 
  endDate: Date
}