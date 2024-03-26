import prisma from "db";

export type Team = {
  id: string;
  owner_user_id: string;
  name: string;
  created_at: Date;
  single_repository?: boolean;
};

export async function fetchUserTeams(userId: string): Promise<Team[]> {
  try {
    const foundUserTeams = await prisma.team.findMany({
      where: {
        owner_user_id: userId,
      },
    });
    return foundUserTeams as Team[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchUserSingleRepoTeams(
  userId: string,
): Promise<Team[]> {
  try {
    const foundUserSingleRepoTeams = await prisma.team.findMany({
      where: {
        owner_user_id: userId,
        single_repository: true,
      },
    });
    return foundUserSingleRepoTeams as Team[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
