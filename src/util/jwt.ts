import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken"

const creatToken=(payload:JwtPayload,secret:string,expiresIn:SignOptions)=>{
const token = jwt.sign(
    payload,secret,{
        expiresIn
    } as SignOptions
);
return token
}
const veryfyedToken =(token:string,secret:string)=>{
try {
    const verifiedToken = jwt.verify(token,secret)

    return {
   success:true,
   data:verifiedToken
    }
} catch (error:any) {
return{
    success:false,
error:error.message
}
}
}
export const jwtUtils ={
    creatToken,veryfyedToken
}