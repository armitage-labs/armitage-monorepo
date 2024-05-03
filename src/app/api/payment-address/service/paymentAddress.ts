import prisma from "db";

export type PaymentAddressDto = {
  id: string;
  chain_id: string;
  team_id: string;
  wallet_address: string;
  created_at: Date;
  payment_receipents: PaymentRecipientDto[];
};

export type PaymentRecipientDto = {
  id: string;
  wallet_address: string;
  payment_percentage: number;
}

export async function fetchTeamPaymentAddresses(teamId: string): Promise<PaymentAddressDto | undefined> {
  try {
    const foundPaymentAddresses = await prisma.paymentAddress.findUnique({
      where: {
        team_id: teamId,
      }
    });
    if (!foundPaymentAddresses) {
      return;
    } else {
      const paymentRecipients = await prisma.paymentRecipient.findMany({
        where: {
          payment_address_id: foundPaymentAddresses.id,
        }
      });
      return {
        ...foundPaymentAddresses,
        payment_receipents: paymentRecipients ? paymentRecipients : [],
      };
    }
  } catch (error) {
    console.log(error);
    return;
  }
}
