import { RUNOFF_FACTOR } from "../constants/runoff-factor";
import { useSignal, useTask$ } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  type InitialValues,
  useForm,
  zodForm$,
  getValues,
} from "@modular-forms/qwik";
import { NumberInput } from "~/components/number-input/number-input";
import { Select } from "~/components/select/select";
import type { DataForm } from "~/forms/data";
import { dataFormSchema } from "~/forms/data";
import { HeroSpanContainer } from "~/styled/hero/hero-container.css";
import { HeroText } from "~/styled/hero/hero-text.css";

export const useFormLoader = routeLoader$<InitialValues<DataForm>>(() => ({
  surface: undefined,
  rainfall: undefined,
  runoff: undefined,
}));

export default component$(() => {
  const [form, { Form, Field }] = useForm<DataForm>({
    loader: useFormLoader(),
    validate: zodForm$(dataFormSchema),
    validateOn: "input",
  });

  const water = useSignal<number>(0);

  useTask$(({ track }) => {
    if (
      track(() => form.dirty) &&
      track(() => dataFormSchema.safeParse(getValues(form)).success)
    ) {
      const values = getValues(form);
      water.value =
        values.rainfall! * values.surface! * RUNOFF_FACTOR[values.runoff!];
    }
  });

  return (
    <>
      <main class="container">
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

              <Field name="rainfall" type="number">
                {(field, props) => (
                  <NumberInput
                    {...props}
                    label="Annual rainfall"
                    placeholder="Annual rainfall (in mm)"
                    step={0.1}
                    min={0.1}
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
            <HeroText>
              {water.value.toFixed(2)}
              m3
            </HeroText>
          </HeroSpanContainer>
        </article>
      </main>
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
