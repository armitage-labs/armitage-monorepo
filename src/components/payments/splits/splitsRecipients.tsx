import { useSplitMetadata } from "@0xsplits/splits-sdk-react";
import { SplitsColumns } from "./splitsColumns";
import { SplitsDataTable } from "./splitsDataTable";
import { useEffect, useState } from "react";

interface SplitsRecipientsProps {
  paymentAddress: string;
  chainId: number;
}

export interface SplitRecipient {
  percentAllocation: number;
  address: string;
}

export default function SplitsRecipients({
  paymentAddress,
  chainId,
}: SplitsRecipientsProps) {
  const [recipient, setRecipient] = useState<SplitRecipient[]>([]);
  const { splitMetadata, isLoading, status, error } = useSplitMetadata(
    chainId,
    paymentAddress,
  );

  useEffect(() => {
    if (splitMetadata != null) {
      const mapedRecipient = splitMetadata.recipients.map((recipient) => ({
        percentAllocation: recipient.percentAllocation,
        address: recipient.recipient.address,
      }));

      setRecipient(mapedRecipient);
    }
  }, [status]);

  return (
    <SplitsDataTable
      columns={SplitsColumns}
      data={recipient}
      isLoading={isLoading}
    ></SplitsDataTable>
  );
}
