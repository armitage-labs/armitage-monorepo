import { Team } from "@prisma/client";
import prisma from "db";

export async function registerUserTeam(
  userId: string,
  teamName: string,
): Promise<Team> {
  const foundTeam = await prisma.team.findFirst({
    where: {
      name: teamName,
      owner_user_id: userId,
    },
  });
  if (!foundTeam) {
    const createdTeam = await prisma.team.create({
      data: {
        name: teamName,
        owner_user_id: userId,
      },
    });
    return createdTeam;
  }
  return foundTeam as Team;
}
