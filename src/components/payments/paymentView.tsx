import { SplitsDataTable } from "@/components/payments/splits/splitsDataTable";
import { SplitsColumns } from "@/components/payments/splits/splitsColumns";
import { Button } from "@/components/ui/button";
import { Split, Wallet2 } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { PaymentAddressDto } from "@/app/api/payments/service/paymentAddressService";
import axios from "axios";
import { useSplitsClient } from "@0xsplits/splits-sdk-react";

interface PaymentsViewProps {
    projectId: string;
    paymentAddress: PaymentAddressDto;
}

export interface Split {
    address?: string;
    controller?: string | null;
    distributorFeePercent?: number;
    createdBlock?: number;
    recipients: Recipients[];
}

export interface Recipients {
    recipient: Address;
    percentAllocation: number;
}

export interface Address {
    address: string;
}

export default function PaymentsView({
    projectId,
    paymentAddress,
}: PaymentsViewProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [split, setSplit] = useState<Split>({ recipients: [] });

    const splitsClient = useSplitsClient({
        chainId: parseInt(paymentAddress.chain_id),
        publicClient: window.ethereum!,
    });

    const handleFetchSplitsMetadata = async () => {
        const metadata = await splitsClient.getSplitMetadata({
            splitAddress: paymentAddress.wallet_address,
        });
        setSplit(metadata as Split);
        setIsLoading(false);
    };

    const handleFetchSplitsEarnings = async () => {
        const response = await splitsClient.getSplitEarnings({
            splitAddress: paymentAddress.wallet_address,
            erc20TokenList: [],
        });
        console.log(response);
    };

    useEffect(() => {
        if (splitsClient._publicClient != null) {
            handleFetchSplitsMetadata();
        }
    }, [splitsClient._publicClient]);

    useEffect(() => {
        if (splitsClient._publicClient != null) {
            handleFetchSplitsEarnings();
        }
    }, [split]);

    return (
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
            <div className="flex items-start">
                <Heading title={`Payment Address`} description="" />
                <div className="flex items-start">
                    <div className="text-left pl-20">
                        <p className="text-xl text-muted-foreground">Network</p>
                        <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            Sepolia
                        </h4>
                    </div>

                    <div className="text-left pl-10">
                        <p className="text-xl text-muted-foreground">Address</p>
                        <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            {paymentAddress.wallet_address}
                        </h4>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center">
                                <Wallet2 className="inline-block" />
                                <CardTitle className="inline-block ml-2">Balance</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center">
                                <div className="text-6xl font-bold">$0.00</div>
                            </div>
                            <div className="border-t border-gray-300 mt-3 mb-3"></div>
                            <div className="flex justify-center">
                                <p className="text-xl text-muted-foreground">
                                    No ETH or ERC-20
                                </p>
                            </div>
                            <div className="border-t border-gray-300 mt-3 mb-3"></div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full text-md flex justify-between items-center"
                                onClick={() => console.log()}
                            >
                                Distribute Balances
                                <Split className="mr-2 h-5 w-5 transform rotate-90" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center">
                                <CardTitle className="inline-block ml-2">
                                    Distribute Splits
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <SplitsDataTable
                                columns={SplitsColumns}
                                data={split.recipients}
                                isLoading={isLoading}
                            ></SplitsDataTable>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
