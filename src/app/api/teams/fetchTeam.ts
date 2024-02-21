import prisma from "db";

export type Team = {
  id: string;
  owner_user_id: string;
  name: string;
  created_at: Date;
};

export async function fetchUserTeam(
  userId: string,
  teamId: string,
): Promise<Team[]> {
  try {
    const foundUserTeams = await prisma.team.findMany({
      where: {
        id: teamId,
        owner_user_id: userId,
      },
    });
    return foundUserTeams as Team[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
