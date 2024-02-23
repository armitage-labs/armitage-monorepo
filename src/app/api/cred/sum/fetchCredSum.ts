import prisma from "db";

export async function fetchCredSum(userId: string) {
  try {
    const allCredScores = await prisma.userScore.findMany({
      where: {
        contribution_calculation: {
          Team: {
            owner_user_id: userId,
          },
        },
        user_type: "USER",
      },
    });
    const result = allCredScores.reduce(function(acc, userScore) {
      return acc + parseFloat(userScore.score);
    }, 0);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
