"use client";

import { useI18n } from "@/i18n/context";
import { LinearUnitConverter } from "@/components/convert/LinearUnitConverter";
import { ENERGY_UNITS, PRESSURE_UNITS } from "@/lib/convert/units-data";

export function DualGroupConverter() {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-sky-200">{t.converter.pressureGroup}</h2>
        <LinearUnitConverter
          units={PRESSURE_UNITS}
          subcategory="pressure-energy"
          routeId="physics/pressure-energy"
          defaultActiveUnit="kPa"
          sampleOverride={{ kPa: "101.325" }}
        />
      </section>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-sky-200">{t.converter.energyGroup}</h2>
        <LinearUnitConverter
          units={ENERGY_UNITS}
          subcategory="pressure-energy"
          routeId="physics/pressure-energy"
          defaultActiveUnit="kJ"
          sampleOverride={{ kJ: "3.6" }}
        />
      </section>
    </div>
  );
}