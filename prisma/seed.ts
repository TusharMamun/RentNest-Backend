
import bcrypt from "bcrypt";
import { AvailabilityStatus, RequestStatus, Role } from "../generated/prisma/enums";
import { prisma } from "../src/lib/prisma";



async function main() {


  // পাসওয়ার্ড হ্যাশ করে নেওয়া
  const commonPassword = await bcrypt.hash("12345678", 10);

  // আপনার ফরম্যাটে create ব্যবহার করে সব ইউজার একসাথে তৈরি
  const [
    admin1,
    landlord1,
    landlord2,
    landlord3,
    tenant1,
    tenant2,
    tenant3,
    tenant4,
  ] = await Promise.all([
    // 1. Admin User
    prisma.user.create({
      data: {
        name: "Super Admin",
        email: "admin@example.com",
        password: commonPassword,
        role: Role.ADMIN,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            bio: "System Administrator managing all platform operations.",
          },
        },
      },
      include: { profile: true },
    }),

    // 2. Landlord 1
    prisma.user.create({
      data: {
        name: "John Landlord",
        email: "landlord@example.com",
        password: commonPassword,
        role: Role.LANDLORD,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            bio: "Property owner with 5+ years of hosting experience in Uttara.",
          },
        },
      },
      include: { profile: true },
    }),

    // 3. Landlord 2
    prisma.user.create({
      data: {
        name: "Rahim Chowdhury",
        email: "rahim.landlord@example.com",
        password: commonPassword,
        role: Role.LANDLORD,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            bio: "Managing luxury apartments in Gulshan and Banani.",
          },
        },
      },
      include: { profile: true },
    }),

    // 4. Landlord 3
    prisma.user.create({
      data: {
        name: "Fatema Nusrat",
        email: "fatema.landlord@example.com",
        password: commonPassword,
        role: Role.LANDLORD,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            bio: "Renting modern family homes in Dhanmondi.",
          },
        },
      },
      include: { profile: true },
    }),

    // 5. Tenant 1
    prisma.user.create({
      data: {
        name: "Jane Tenant",
        email: "tenant@example.com",
        password: commonPassword,
        role: Role.TENANT,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            bio: "Looking for a quiet and clean 2-bedroom apartment.",
          },
        },
      },
      include: { profile: true },
    }),

    // 6. Tenant 2
    prisma.user.create({
      data: {
        name: "Anik Ahmed",
        email: "anik.tenant@example.com",
        password: commonPassword,
        role: Role.TENANT,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
            bio: "Software Engineer looking for a bachelor studio flat.",
          },
        },
      },
      include: { profile: true },
    }),

    // 7. Tenant 3
    prisma.user.create({
      data: {
        name: "Sabrina Islam",
        email: "sabrina.tenant@example.com",
        password: commonPassword,
        role: Role.TENANT,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1580489944761-15a19d654956",
            bio: "University student looking for a clean sublet near Mirpur.",
          },
        },
      },
      include: { profile: true },
    }),

    // 8. Tenant 4
    prisma.user.create({
      data: {
        name: "Tanvir Hossain",
        email: "tanvir.tenant@example.com",
        password: commonPassword,
        role: Role.TENANT,
        profile: {
          create: {
            profilePhoto:
              "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
            bio: "Remote worker looking for a peaceful apartment with high-speed internet.",
          },
        },
      },
      include: { profile: true },
    }),
  ]);
const [category1, category2, category3, category4, category5] =
    await Promise.all([
      prisma.category.create({
        data: {
          catagoryName: "Apartment",
          userId: admin1.id,
        },
      }),

      prisma.category.create({
        data: {
          catagoryName: "Studio Flat",
          userId: landlord1.id,
        },
      }),

      prisma.category.create({
        data: {
          catagoryName: "Duplex Villa",
          userId: admin1.id,
        },
      }),

      prisma.category.create({
        data: {
          catagoryName: "Sublet / Single Room",
          userId: landlord1.id,
        },
      }),

      prisma.category.create({
        data: {
          catagoryName: "Commercial Space",
          userId: admin1.id,
        },
      }),
    ]);

;

    const [property1, property2, property3, property4] = await Promise.all([
    prisma.property.create({
      data: {
        title: "Luxury 3-Bed Apartment in Gulshan 2",
        description:
          "Fully furnished modern apartment with lake view, 24/7 generator backup, and high security.",
        location: "Gulshan 2, Dhaka",
        pricePerMonth: 65000,
        amenities: ["WiFi", "Air Conditioning", "Parking", "Elevator", "Security Guard"],
        isAvailable: AvailabilityStatus.AVAILABLE,
        categoryId: category1.id,
        landlordId: landlord1.id,
      },
    }),

    prisma.property.create({
      data: {
        title: "Cozy Studio Flat near AIUB & NSU",
        description:
          "Perfect studio flat for students or bachelors. Fully tiled with modern kitchen setup.",
        location: "Kuratoli, Bashundhara, Dhaka",
        pricePerMonth: 18000,
        amenities: ["WiFi", "Balcony", "CCTV Security"],
        isAvailable: AvailabilityStatus.AVAILABLE,
        categoryId: category2.id,
        landlordId: landlord1.id,
      },
    }),

    prisma.property.create({
      data: {
        title: "Duplex Villa with Private Garden",
        description:
          "Spacious 4-bedroom duplex villa located in a quiet residential zone with a private lawn.",
        location: "Sector 3, Uttara, Dhaka",
        pricePerMonth: 120000,
        amenities: ["Private Garden", "Garage", "Air Conditioning", "Solar Power", "Pet Friendly"],
        isAvailable: AvailabilityStatus.AVAILABLE,
        categoryId: category3.id,
        landlordId: landlord2.id,
      },
    }),

    prisma.property.create({
      data: {
        title: "Modern Family Apartment near Dhanmondi Lake",
        description:
          "Well ventilated 3-bedroom apartment on the 5th floor with south-facing balcony.",
        location: "Road 27, Dhanmondi, Dhaka",
        pricePerMonth: 45000,
        amenities: ["WiFi", "Elevator", "Gas Pipeline", "24/7 Security"],
        isAvailable: AvailabilityStatus.AVAILABLE, // টেস্ট করার জন্য RENTED স্ট্যাটাস
        categoryId: category4.id,
        landlordId: landlord2.id,
      },
    }),
  ]);


const [rentalRequest1, rentalRequest2, rentalRequest3] = await Promise.all([
  // Request 1: Pending Status (1 Month)
  prisma.rentalRequest.create({
    data: {
      propertyId: property1.id,
      tenantId: tenant1.id,
      startDate: new Date("2026-08-01T00:00:00.000Z"),
      endDate: new Date("2026-09-01T00:00:00.000Z"), // ১ মাস
      totalPrice: property1.pricePerMonth * 1, // ১ মাসের ভাড়া
      status: RequestStatus.PENDING,
    },
  }),

  // Request 2: Approved Status (1 Month)
  prisma.rentalRequest.create({
    data: {
      propertyId: property2.id,
      tenantId: tenant1.id,
      startDate: new Date("2026-09-01T00:00:00.000Z"),
      endDate: new Date("2026-10-01T00:00:00.000Z"), // ১ মাস
      totalPrice: property2.pricePerMonth * 1,
      status: RequestStatus.APPROVED,
    },
  }),

  // Request 3: Rejected Status (1 Month)
  prisma.rentalRequest.create({
    data: {
      propertyId: property1.id,
      tenantId: tenant2.id,
      startDate: new Date("2026-10-01T00:00:00.000Z"),
      endDate: new Date("2026-11-01T00:00:00.000Z"), // ১ মাস
      totalPrice: property1.pricePerMonth * 1,
      status: RequestStatus.REJECTED,
    },
  }),
]);

const [review1, review2] = await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Excellent experience! The property is very clean and well-maintained.",
        tenantId: tenant1.id,
        propertyId: property1.id,
        rentelRequestId: rentalRequest1.id,
      },
    }),

    prisma.review.create({
      data: {
        rating: 4,
        comment: "Good location, peaceful environment, and supportive landlord.",
        tenantId: tenant2.id,
        propertyId: property2.id,
        rentelRequestId: rentalRequest2.id,
      },
    }),
  ]);





}

main()
  .catch((e) => {

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });