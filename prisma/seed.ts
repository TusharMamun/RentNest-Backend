import bcrypt from "bcrypt";
import config from "../src/config";
import { prisma } from "../src/lib/prisma";
import { Role } from "../generated/prisma/enums";

async function main() {
  const saltRounds = Number(config.bycript_salt_round) || 10;
  
  // Single hashed password shared by all users
  const commonPassword = await bcrypt.hash("password123", saltRounds);


  await Promise.all([
    prisma.user.create({
      data: {
        name: "System Admin",
        email: "admin@example.com",
        password: commonPassword,
        role: Role.ADMIN,
        profile: {
          create: {
            profilePhoto: "https://example.com/admin.jpg",
            bio: "System Administrator overseeing property management operations.",
          },
        },
      },
      include: {
        profile: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "John Landlord",
        email: "landlord@example.com",
        password: commonPassword,
        role: Role.LANDLORD,
        profile: {
          create: {
            profilePhoto: "https://example.com/landlord.jpg",
            bio: "Property owner with apartments available for rent.",
          },
        },
      },
      include: {
        profile: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Jane Tenant",
        email: "tenant@example.com",
        password: commonPassword,
        role: Role.TENANT,
        profile: {
          create: {
            profilePhoto: "https://example.com/tenant.jpg",
            bio: "Looking for a quiet and clean apartment.",
          },
        },
      },
      include: {
        profile: true,
      },
    }),
  ]);

  console.log("Database seeded successfully!");
}

main().then(process.exit(0))