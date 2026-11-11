// SERVER-ONLY Postgres pool (idic_postgres container on the VPS).
import "server-only";
import { Pool } from "pg";

const globalForPg = globalThis as unknown as { __idicPool?: Pool };

export const db: Pool | null = process.env.DATABASE_URL
  ? (globalForPg.__idicPool ??= new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }))
  : null;
