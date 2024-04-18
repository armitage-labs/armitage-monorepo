import prisma from "db";

export async function createAnonymousUser(eamil: string): Promise<string> {
  try {
    const nonymousUser = await prisma.anonymousUsers.create({
      data: {
        email: eamil,
      },
    });
    return nonymousUser.id;
  } catch (error) {
    return Math.random().toString();
  }
}
