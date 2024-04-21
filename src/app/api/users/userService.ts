import prisma from "db";

export async function createAnonymousUser(email: string): Promise<string> {
  try {
    const foundAnonymousUser = await prisma.anonymousUsers.findFirst({
      where: {
        email: email,
      },
    });
    if (foundAnonymousUser) {
      return foundAnonymousUser.id;
    } else {
      const anonymousUser = await prisma.anonymousUsers.create({
        data: {
          email: email,
        },
      });
      return anonymousUser.id;
    }
  } catch (error) {
    throw new Error(`Error creating anonymous user: ${error}`);
  }
}
