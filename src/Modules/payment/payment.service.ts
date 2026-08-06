import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/strip";
import { AppError } from "../../util/app-erro";
import { IPayment } from "./payment.interface";
import httpStatus from "http-status";
export  const creatCheckoutSession = async(payload:IPayment ,renterId:string)=>{
const { requestId} =payload
// const rentelData = prisma.rentalRequest.findUnique({
//   where:{
//     id:requestId
//   },include:{
// subscriptions:true,
// property:true
//   }
// })
const rentelData = await prisma.rentalRequest.findUnique({
  where:{
    id:requestId
  },include:{
    property:true,
    subscriptions:true,

  }
})
if (!rentelData) {
  throw new AppError(httpStatus.NOT_FOUND, "Rental record not found!");
}

if (rentelData.tenantId !== renterId) {
  throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to pay for this rental!");
}

// if (rentelData.status !== "PENDING") {
//   throw new AppError(httpStatus.BAD_REQUEST, "Payment can only be processed for pending rentals!");
// }

if (rentelData.subscriptions?.status === "COMPLETED") {
  throw new AppError(httpStatus.BAD_REQUEST, "You have already paid for this rental!");
}
const session =await stripe.checkout.sessions.create({
  mode:"payment",
  metadata:{rentelId:rentelData.id},
success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `http://localhost:3000/cancel`,
  line_items:[{
    quantity:1,
    price_data:{
      currency:"USD",
      unit_amount:Math.round(rentelData.totalPrice * 100),
      product_data:{
        name:rentelData.property.title
      }
    }
  }]
})
await prisma.subscription.upsert({
  where: {
    rentRequestid: rentelData.id, 
  },
  create: {
    rentRequestid: rentelData.id,
    tenantId: rentelData.tenantId, 
    totalAmount: rentelData.totalPrice,
    trasectionId: session.id,
   
  },
  update: {
    totalAmount: rentelData.totalPrice,
    trasectionId: session.id,
  status:"PENDING"
  },
});
return{checkOutUrl:session.url}
}

export  const complitPayment=async( rentRequestid:string,trasectionId:string  )=>{
  const payment =await prisma.subscription.findUnique({
    where:{
      rentRequestid:rentRequestid
    }
  })
  const notavailableProperystatus = await prisma.rentalRequest.findUnique({
    where:{
      id:rentRequestid
    }
  })
  const propertyid = notavailableProperystatus?.propertyId
  if(!payment || payment.status ==="COMPLETED")return
await prisma.$transaction([
  prisma.subscription.update({
 where:{
      rentRequestid:rentRequestid
    },data:{status:"COMPLETED" ,trasectionId}
  }),
  prisma.rentalRequest.update({
    where:{id:rentRequestid},
    data:{
      status:"CONFIRMED"
    }
  }),
  prisma.property.update({
    where:{
      id:propertyid
    },
    data:{
      isAvailable:"NOT_AVAILABLE"
    }
  })
])


}


const getAllPaymentService = async () => {
  const result = await prisma.subscription.findMany({
    include:{
      tenant:true
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return result;
};

const getSinglePaymentFromDB = async (id: string) => {
  const result = await prisma.subscription.findUnique({
    where: { id },
    include: {
   tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment record not found!");
  }

  return result;
};


export const paymentServices={
  getAllPaymentService,getSinglePaymentFromDB
}