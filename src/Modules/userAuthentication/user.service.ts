import { prisma } from "../../lib/prisma";
;
import httpStatus from 'http-status'; // 
import bcrypt from 'bcrypt';
import config from "../../config";
import { RegesterUserPayload } from "./user.interface";

const regesterService=async(payload:RegesterUserPayload)=>{
 const { name, email, password,profilePhoto  } = payload;

    // ১. ইউজার অলরেডি রেজিস্টার্ড কিনা চেক করা
    const isUserExist = await prisma.user.findUnique({
      where: { email }
    });

    // 💡 সমাধান: throw না করে সরাসরি 409 Conflict রেসপন্স রিটার্ন করা
    if (isUserExist) {
throw new Error("User with This email Already exists")
    }

    // ২. পাসওয়ার্ড হ্যাশ করা
    const hashPassword = await bcrypt.hash(password, Number(config.bycript_salt_round));
    
    // ৩. ডাটাবেজে ইউজার তৈরি করা
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      }
    });
    const profile = await prisma.profile.create({
           data:{
        userId:createdUser.id,
        profilePhoto
      }
    }
    )

    // ৪. পাসওয়ার্ড ছাড়া ইউজারের ডেটা তুলে আনা
    const user = await prisma.user.findUnique({
      where: {
        id: createdUser.id,
        email: createdUser.email
      },include:{
        profile:true
      },
      omit: {
        password: true
      }
    });


return user

}
const getProfile=async(userid:string)=>{
const userprofile = await prisma.user.findFirstOrThrow({
  where:{
    id:userid
  },
  include:{
    profile:true
  },
  omit:{
    password:true
  }
})
return userprofile
}
const upadteUser =async(userId:string,payload:any)=>{
  const {name,role,activestatus,profilePhoto,bio} = payload;
  const updateData = await prisma.user.update({
    where:{id:userId},
    data:{
      name,
      role,
      activestatus,
      profile:{
update:{
  profilePhoto,bio
}
      }

    },
    omit:{
      password:true
    },
    include:{
      profile:true
    }
  })
  return updateData
}

export const userAuthService={
regesterService,
getProfile,
upadteUser
}