import { RUNOFF_FACTOR } from "../constants/runoff-factor";
import { useComputed$, useSignal, useTask$ } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  type InitialValues,
  useForm,
  zodForm$,
  getValues,
  formAction$,
  validate,
  setValues,
} from "@modular-forms/qwik";
import { NumberInput } from "~/components/number-input/number-input";
import { Select } from "~/components/select/select";
import { TextInput } from "~/components/text-input/text-iput";
import type { DataForm } from "~/forms/data";
import { dataFormSchema } from "~/forms/data";
import { useGeolocalisation } from "~/hooks/useGeolocalisation";
import { Type, getRainfall } from "~/services/rainfall/rainfall";
import { HeroSpanContainer } from "~/styled/hero/hero-container.css";
import { HeroText } from "~/styled/hero/hero-text.css";

export const useFormLoader = routeLoader$<InitialValues<DataForm>>(() => ({
  surface: undefined,
  runoff: undefined,
  location: {
    lat: undefined,
    long: undefined,
  },
}));

export const useFormAction = formAction$<DataForm, { rainfall: number }>(
  async (values) => {
    // Runs on server
    const { location } = values;
    const stats = await getRainfall({ ...location, type: Type.LastYearAvg });
    return {
      status: "success",
      data: {
        rainfall:
          stats.daily.precipitation_sum.reduce((a, b) => a! + b!, 0) || 0,
      },
    };
  },
  zodForm$(dataFormSchema)
);

export default component$(() => {
  const { position } = useGeolocalisation();

  const [form, { Form, Field }] = useForm<DataForm, { rainfall: number }>({
    loader: useFormLoader(),
    validate: zodForm$(dataFormSchema),
    action: useFormAction(),
    validateOn: "input",
    revalidateOn: "input",
  });

  const water = useSignal<number>(0);

  useTask$(({ track }) => {
    if (
      track(() => form.dirty) &&
      track(() => dataFormSchema.safeParse(getValues(form)).success)
    ) {
      form.element?.requestSubmit();
    }
  });

  useTask$(({ track }) => {
    const coords = track(() => position.value);
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

  useComputed$(() => {
    if (form.response.data) {
      const { rainfall } = form.response.data;
      const { surface, runoff } = getValues(form);
      water.value = (rainfall * surface! * RUNOFF_FACTOR[runoff!]) / 1000;
    }
  });

  return (
    <>
      <article class="grid">
        <div>
          <hgroup>
            <h1>Estimate a water harvest</h1>
            <h2>Find out how much water you can have yearly</h2>
          </hgroup>
          <Form>
            <Field name="surface" type="number">
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

            <Field type="string" name="location.lat">
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
            <Field type="string" name="location.long">
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

            <Field type="string" name="runoff">
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
          </Form>
        </div>
        <HeroSpanContainer>
          <HeroText>{water.value.toFixed(2)} m3</HeroText>
          {!!water.value && <i>Last year at this location</i>}
        </HeroSpanContainer>
      </article>
    </>
  );
});

export const head: DocumentHead = {
  title: "Water harvest",
  meta: [
    {
      name: "description",
      content: "Havest water : estimate your harvest",
    },
  ],
};
