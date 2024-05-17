"use client";

import { useSplitMetadata } from "@0xsplits/splits-sdk-react";
import { SplitsColumns } from "./splitsColumns";
import { SplitsDataTable } from "./splitsDataTable";
import { useEffect, useState } from "react";
import axios from "axios";

interface SplitsRecipientsProps {
  paymentAddress: string;
  chainId: number;
  setLoadedSuccessfully: (isSuccessfully: boolean) => void;
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
  setLoadedSuccessfully,
}: SplitsRecipientsProps) {
  const [recipient, setRecipient] = useState<SplitRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { splitMetadata, status, error } = useSplitMetadata(
    chainId,
    paymentAddress,
  );

  const handleSplitMetadata = async (splitRecipient: SplitRecipient[]) => {
    const { data } = await axios.post(`/api/wallet/search`, splitRecipient);
    if (data.success) {
      setRecipient(data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (splitMetadata != null) {
      const mappedRecipient = splitMetadata.recipients.map((recipient) => ({
        percentAllocation: recipient.percentAllocation,
        address: recipient.recipient.address,
      }));
      handleSplitMetadata(mappedRecipient);
    }
    if (error) {
      setLoadedSuccessfully(false);
    }
  }, [status, error]);

  return (
    <SplitsDataTable
      columns={SplitsColumns}
      data={recipient}
      isLoading={isLoading}
    ></SplitsDataTable>
  );
}
