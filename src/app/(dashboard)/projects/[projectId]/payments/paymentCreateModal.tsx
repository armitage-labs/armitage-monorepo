import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

type CreatePaymentAddressModalProps = {
    projectId: string;
};

export function CreatePaymentAddressModal({
    ...props
}: CreatePaymentAddressModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mr-2">Create Payment Address</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center space-x-2 pt-6 pb-6">
                    <div>
                        Please take note you have 1 Contributor that has not configured his wallet address on Armitage. You can continue and redistribute this contributor score equally between all configured contributors.
                        <div className="pt-6">
                            <div class="flex justify-between">
                                <Button
                                    className="w-1/2 mr-2"
                                    onClick={() => {
                                        console.log("Hi");
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    className="w-1/2  ml-2"
                                    onClick={() => {
                                        console.log("Hi");
                                    }}
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
