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
    const userWallet = await prisma.userWallet.upsert({
      where: {
        user_id: userId,
      },
      update: {
        address: address,
      },
      create: {
        user_id: userId,
        address: address,
      },
    });
    return userWallet;
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
