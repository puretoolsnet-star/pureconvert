"use client";

import { PressureEnergyConverter } from "@/components/convert/PressureEnergyConverter";
import { DiscountCalculator } from "@/components/convert/DiscountCalculator";
import { AreaConverter } from "@/components/convert/AreaConverter";
import { VolumeConverter } from "@/components/convert/VolumeConverter";
import { WeightConverter } from "@/components/convert/WeightConverter";
import { LengthConverter } from "@/components/convert/LengthConverter";
import { LinearUnitConverter } from "@/components/convert/LinearUnitConverter";
import { PercentCalculator } from "@/components/convert/PercentCalculator";
import { ProportionCalculator } from "@/components/convert/ProportionCalculator";
import { RatioAspectCalculator } from "@/components/convert/RatioAspectCalculator";
import { SpeedConverter } from "@/components/convert/SpeedConverter";
import { TemperatureConverter } from "@/components/convert/TemperatureConverter";
import { DataStorageConverter } from "@/components/convert/DataStorageConverter";
import { DataTransferConverter } from "@/components/convert/DataTransferConverter";
import type { ToolRouteId } from "@/lib/tools/routes";

export function ConverterPanel({ routeId }: { routeId: ToolRouteId }) {
  switch (routeId) {
    case "measurements/length":
      return <LengthConverter />;
    case "measurements/area":
      return <AreaConverter />;
    case "measurements/volume":
      return <VolumeConverter />;
    case "physics/weight":
      return <WeightConverter />;
    case "physics/temperature":
      return <TemperatureConverter />;
    case "physics/speed":
      return <SpeedConverter />;
    case "physics/pressure-energy":
      return <PressureEnergyConverter />;
    case "digital/data-storage":
      return <DataStorageConverter />;
    case "digital/data-transfer":
      return <DataTransferConverter />;
    case "digital/ratios-aspect":
      return <RatioAspectCalculator />;
    case "calculators/percentages":
      return <PercentCalculator />;
    case "calculators/discounts":
      return <DiscountCalculator />;
    case "calculators/proportions":
      return <ProportionCalculator />;
    default:
      return null;
  }
}