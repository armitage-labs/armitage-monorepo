import prisma from "db";

export async function deleteTeam(
  teamId: string,
  userId: string,
): Promise<boolean> {
  try {
    await prisma.team.delete({
      where: {
        id: teamId,
        owner_user_id: userId,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}
