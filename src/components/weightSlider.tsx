import { WeightConfigField } from "@/app/api/configuration/weightConfig.dto";
import { Slider } from "./ui/slider";
import { useState } from "react";
import { HoverExplainer } from "./hoverExplainer";

interface WeightSliderProps {
  weightName: string;
  weight: WeightConfigField;
  onChange(value: number, key: string): void;
}

export default function WeightSlider({
  weightName,
  weight,
  onChange,
}: WeightSliderProps) {
  const [value, setValue] = useState<number>(weight.value);

  const onValueChange = async (value: number[]) => {
    setValue(value[0]);
    onChange(value[0], weightName);
  };

  return (
    <>
      <div className="flex">
        <h4 className="text-xl font-semibold tracking-tight pb-3 pr-3">
          {weight.lable}
        </h4>
        <HoverExplainer title={weight.title} description={weight.description} />
      </div>
      <div className="flex">
        <Slider
          defaultValue={[weight.value]}
          max={weight.max}
          min={weight.min}
          step={weight.step}
          onValueChange={(value) => onValueChange(value)}
        />
        <h4 className="pl-4 text-xl">{value}</h4>
      </div>
    </>
  );
}
