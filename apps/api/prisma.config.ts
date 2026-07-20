// Prisma 7 moved the Migrate CLI's connection config out of schema.prisma 
// and into this file. This only affects `prisma migrate` commands — the 
// actual app (src/lib/prisma.js) connects via its own @prisma/adapter-pg 
// Pool built directly from DATABASE_URL, so this file has no effect on 
// runtime queries. 
import "dotenv/config"; 
import { defineConfig, env } from "@prisma/config"; 

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node ./prisma/seed.js",
  },
  datasource: { 
    url: env("DATABASE_URL"), 
  }, 
});
