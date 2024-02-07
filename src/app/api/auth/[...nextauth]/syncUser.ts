import prisma from "db";

export async function synchronizeUser(
  email: string,
  username: string,
): Promise<string> {
  const foundUser = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!foundUser) {
    const createdUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
      },
    });
    return createdUser.id;
  }
  return foundUser.id;
}
