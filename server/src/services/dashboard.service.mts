export const findUserbyId = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { userId },
        select: {
            email: true,
            userId: true,
            walletBalance: true
        }
    });
    return user;
}