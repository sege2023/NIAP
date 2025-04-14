import { prisma } from "../prisma/prisma.mjs"

export const storeTempcode = async () => {
    await prisma.verficationCode.create
}