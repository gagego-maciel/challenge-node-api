import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || '',
    },
    out: './drizzle',
    schema: './src/database/schema.ts',
})