import prisma from "db";
import { UserCredDto } from "../credmanager/route";

export async function fetchUserCred(teamId: string): Promise<UserCredDto[]> {
  try {
    const contributionCalculation =
      await prisma.contributionCalculation.findFirst({
        where: {
          team_id: teamId,
        },
        orderBy: {
          created_at: "desc",
        },
      });

    if (contributionCalculation) {
      const userCreds = await prisma.userScore.findMany({
        where: {
          contribution_calculation_id: contributionCalculation.id,
        },
      });

      return userCreds.map((cred) => {
        return {
          totalCred: Number(cred.score),
          userName: cred.username,
          type: cred.user_type,
        };
      });
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
