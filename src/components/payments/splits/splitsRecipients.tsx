"use client";

import { useSplitMetadata } from "@0xsplits/splits-sdk-react";
import { SplitsColumns } from "./splitsColumns";
import { SplitsDataTable } from "./splitsDataTable";
import { useEffect, useState } from "react";
import axios from "axios";

interface SplitsRecipientsProps {
  paymentAddress: string;
  chainId: number;
}

export interface SplitRecipient {
  username?: string;
  ens?: string;
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

  const handleSplitMetadata = async (splitRecipient: SplitRecipient[]) => {
    const { data } = await axios.post(`/api/wallet/search`, splitRecipient);
    console.log(data);
    if (data.success) {
      setRecipient(data.data);
    }
  };

  useEffect(() => {
    if (splitMetadata != null) {
      const mapedRecipient = splitMetadata.recipients.map((recipient) => ({
        percentAllocation: recipient.percentAllocation,
        address: recipient.recipient.address,
      }));
      handleSplitMetadata(mapedRecipient);
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
