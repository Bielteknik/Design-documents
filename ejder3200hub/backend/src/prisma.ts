// FIX: Switched from `require` to `import` for proper TypeScript type support for PrismaClient.
import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type
declare global {
  // FIX: Using the imported `PrismaClient` type instead of `any` for type safety.
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
