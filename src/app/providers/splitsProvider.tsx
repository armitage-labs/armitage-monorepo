"use client";

import { SplitsProvider } from "@0xsplits/splits-sdk-react";

type Props = {
  children?: React.ReactNode;
};

export const PaymentSplitsProvider = ({ children }: Props) => {
  return (
    <>
      <SplitsProvider>{children}</SplitsProvider>
    </>
  );
};
