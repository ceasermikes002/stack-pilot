import { PrismaClient } from '@prisma/client'

// In Nuxt, we can attach this to the global scope or let Nitro handle it per-request via a plugin
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.__db__) {
        global.__db__ = new PrismaClient()
    }
    prisma = global.__db__
}

export { prisma }
