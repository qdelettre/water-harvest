import { component$, useTask$ } from "@builder.io/qwik";
import { Field } from "@modular-forms/qwik";
import { setValues, validate } from "@modular-forms/qwik";
import { RUNOFF_FACTOR } from "~/constants/runoff-factor";
import { NumberInput } from "../number-input/number-input";
import { Select } from "../select/select";
import { TextInput } from "../text-input/text-iput";
import type { WaterHarvestFormStore } from "~/forms/water-harvest-form";

export interface WaterHarvestFormProps {
  form: WaterHarvestFormStore;
  position: [number, number] | undefined;
}

export const WaterHarvestForm = component$<WaterHarvestFormProps>(
  ({ form, position }) => {
    useTask$(({ track }) => {
      const coords = track(() => position);
      if (coords) {
        const [lat, long] = coords;
        setValues(form, {
          location: {
            lat: lat.toString(),
            long: long.toString(),
          },
        });
        validate(form, ["location.lat", "location.long"]);
      }
    });

    return (
      <>
        <Field of={form} name="surface" type="number">
          {(field, props) => (
            <NumberInput
              {...props}
              label="Roof surface"
              placeholder="Your roof surface (m3)"
              step={0.1}
              min={0.1}
              value={field.value}
              error={field.error}
              dirty={field.dirty}
              required
            />
          )}
        </Field>

        <Field of={form} type="string" name="location.lat">
          {(field, props) => (
            <TextInput
              {...props}
              label="Lat"
              type="text"
              placeholder="Latitude"
              value={field.value}
              error={field.error}
              dirty={field.dirty}
              required
            />
          )}
        </Field>
        <Field of={form} type="string" name="location.long">
          {(field, props) => (
            <TextInput
              {...props}
              label="Long"
              type="text"
              placeholder="Longitude"
              value={field.value}
              error={field.error}
              dirty={field.dirty}
              required
            />
          )}
        </Field>

        <Field of={form} type="string" name="runoff">
          {(field, props) => (
            <Select
              {...props}
              label="Roof type"
              placeholder="Roof type"
              value={field.value}
              error={field.error}
              dirty={field.dirty}
              required
              hint="Roof type is a LS (loss factor)"
              options={Object.keys(RUNOFF_FACTOR).map((label) => ({
                label,
                value: label,
              }))}
            />
          )}
        </Field>
      </>
    );
  }
);
