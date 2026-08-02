import { Role } from "../../../generated/prisma/enums";

export interface RegesterUserPayload{
    name:string,
    email:string,
    password:string,
    role?:Role,
    profilePhoto?:string
}