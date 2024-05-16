import { useSignal, useTask$ } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  type InitialValues,
  zodForm$,
  getValues,
  useForm,
} from "@modular-forms/qwik";
import { WaterHarvestForm } from "~/components/water-harvest-form/water-harvest-form";
import { RUNOFF_FACTOR } from "~/constants/runoff-factor";
import type {
  WaterHarvestFormResponse,
  WaterHarvestFormValues,
} from "~/forms/water-harvest-form";
import { WATER_HARVEST_FORM_SCHEMA } from "~/forms/water-harvest-form";
import { useFormAction } from "~/forms/water-harvest-form";
import { useGeolocalisation } from "~/hooks/useGeolocalisation";
import { HeroSpanContainer } from "~/styled/hero/hero-container.css";
import { HeroText } from "~/styled/hero/hero-text.css";

export const useFormLoader = routeLoader$<
  InitialValues<WaterHarvestFormValues>
>(() => ({
  surface: undefined,
  runoff: undefined,
  location: {
    lat: undefined,
    long: undefined,
  },
}));

export default component$(() => {
  const { position } = useGeolocalisation();
  const water = useSignal<number>(0);
  const [form, { Form }] = useForm<
    WaterHarvestFormValues,
    WaterHarvestFormResponse
  >({
    loader: useFormLoader(),
    validate: zodForm$(WATER_HARVEST_FORM_SCHEMA),
    action: useFormAction(),
    validateOn: "input",
    revalidateOn: "input",
  });

  useTask$(({ track }) => {
    const shouldSubmit: boolean = track(
      () =>
        form.dirty &&
        WATER_HARVEST_FORM_SCHEMA.safeParse(getValues(form)).success,
    );
    if (shouldSubmit) {
      form.element?.requestSubmit();
    }
  });

  useTask$(({ track }) => {
    const data = track(() => form.response.data);
    if (data) {
      const { rainfall } = data;
      const { surface, runoff } = getValues(form);
      water.value = (rainfall * surface! * RUNOFF_FACTOR[runoff!]) / 1000;
    }
  });

  return (
    <article class="grid">
      <div>
        <hgroup>
          <h1>Estimate a water harvest</h1>
          <h2>Find out how much water you can have yearly</h2>
        </hgroup>
        <Form>
          <WaterHarvestForm form={form} position={position.value} />
        </Form>
      </div>
      <HeroSpanContainer>
        <HeroText>{water.value.toFixed(2)} m3</HeroText>
        {!!water.value && <i>Last year at this location</i>}
      </HeroSpanContainer>
    </article>
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
