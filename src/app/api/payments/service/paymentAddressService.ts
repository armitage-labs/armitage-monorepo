import prisma from "db";
import { PaymentAddressDto } from "../route";

export async function createPaymentAddress(
  userId: string,
  teamId: string,
  paymentAddress: PaymentAddressDto
): Promise<PaymentAddressDto | undefined> {
  try {
    const foundTeam = await prisma.team.findFirst({
      where: {
        id: teamId,
        owner_user_id: userId,
      },
    });
    if (foundTeam == null) {
      console.error(
        `Team was not found for user userId:[${userId}] teanId:[${teamId}]`
      );
      return;
    }

    const createdPaymentAddress = await prisma.paymentAddress.create({
      data: {
        chain_id: paymentAddress.chain_id,
        wallet_address: paymentAddress.wallet_address,
        team_id: teamId,
      },
    });

    if (!createdPaymentAddress) {
      return;
    } else {
      await prisma.paymentRecipient.createMany({
        data: paymentAddress.payment_receipents.map((receipent) => ({
          ...receipent,
          payment_address_id: createdPaymentAddress.id,
        })),
      });
      const paymentRecipients = await prisma.paymentRecipient.findMany({
        where: {
          payment_address_id: createdPaymentAddress.id,
        },
      });
      return {
        ...createdPaymentAddress,
        payment_receipents: paymentRecipients ? paymentRecipients : [],
      };
    }
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function fetchTeamPaymentAddresses(
  teamId: string
): Promise<PaymentAddressDto | undefined> {
  try {
    const foundPaymentAddresses = await prisma.paymentAddress.findUnique({
      where: {
        team_id: teamId,
      },
    });
    if (!foundPaymentAddresses) {
      return;
    } else {
      const paymentRecipients = await prisma.paymentRecipient.findMany({
        where: {
          payment_address_id: foundPaymentAddresses.id,
        },
      });
      return {
        ...foundPaymentAddresses,
        payment_receipents: paymentRecipients ? paymentRecipients : [],
      };
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
