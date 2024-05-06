import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface PaymentSliderProps {
  onChange(value: number): void;
}

export default function PaymentSlider({ onChange }: PaymentSliderProps) {
  const [value, setValue] = useState<number>(5);

  const onValueChange = async (value: number[]) => {
    setValue(value[0]);
    onChange(value[0]);
  };

  return (
    <>
      <div className="flex w-[300px]">
        <Slider
          defaultValue={[5]}
          max={10}
          min={1}
          step={1}
          onValueChange={(value) => onValueChange(value)}
        />
      </div>
    </>
  );
}
