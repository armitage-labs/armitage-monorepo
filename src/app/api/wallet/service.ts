import prisma from "db";

export type UserWallet = {
  id: string;
  user_id: string;
  address: string;
  created_at: Date;
};

export async function saveUserWallet(
  userId: string,
  address: string,
): Promise<UserWallet | null> {
  try {
    // Check if user wallet exists for the given user ID
    const existingWallet = await prisma.userWallet.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (existingWallet) {
      // User wallet exists, update it
      const updatedWallet = await prisma.userWallet.update({
        where: {
          user_id: userId,
        },
        data: {
          address: address,
        },
      });
      return updatedWallet;
    } else {
      // User wallet doesn't exist, create it
      const newWallet = await prisma.userWallet.create({
        data: {
          user_id: userId,
          address: address,
        },
      });
      return newWallet;
    }
  } catch (error) {
    console.error("Error saving user wallet:", error);
    return null;
  }
}

export async function findUserWallet(
  userId: string,
): Promise<UserWallet | null> {
  try {
    const wallet = await prisma.userWallet.findFirst({
      where: {
        user_id: userId,
      },
    });
    return wallet as UserWallet;
  } catch (error) {
    console.log(error);
    return null;
  }
}
