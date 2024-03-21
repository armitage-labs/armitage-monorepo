import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingCircle } from "./navigation/loading";

type LoadingCalculationsProps = {
  onSubmit: () => void;
  onClose: () => void;
  isOpen: boolean;
};

export function LoadingCalculations({ ...props }: LoadingCalculationsProps) {
  return (
    <Dialog open={props.isOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            props.onSubmit();
          }}
        >
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Loading contribution graph</DialogTitle>
          <DialogDescription>
            Please wait while we are generating your contribution graph
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-x-2 pt-6 pb-6">
          <LoadingCircle></LoadingCircle>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
