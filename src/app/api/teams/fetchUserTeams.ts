export type Team = {
  id: string;
  owner_user_id: string;
  name: string;
  created_at: Date;
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
