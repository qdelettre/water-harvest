import { RUNOFF } from "~/constants/runoff";
import { z } from "zod";
import type { FormStore } from "@modular-forms/qwik";
import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { Type, getRainfall } from "~/services/rainfall/rainfall";

const positiveErrorMessage = "Please enter a positive value";
const minErrorMessage = "Please enter a value superior to zero";
const getInvalidValueMessage = (kind: string) => `Invalid ${kind} value`;

const isValidLongitude = (value: string) => {
  const longitude = parseInt(value, 10);
  return longitude >= -180 && longitude <= 180;
};

const isValidLatitude = (value: string) => {
  const latitude = parseFloat(value);
  return latitude >= -90 && latitude <= 90;
};

const lat = z.string().refine(isValidLatitude, {
  message: getInvalidValueMessage("longitude"),
});

const long = z.string().refine(isValidLongitude, {
  message: getInvalidValueMessage("latitude"),
});

const location = z.object({
  lat,
  long,
});

const baseField = z
  .number({
    required_error: "This field is required",
    invalid_type_error: "Please enter a number",
  })
  .positive(positiveErrorMessage)
  .min(0.1, minErrorMessage);

export const WATER_HARVEST_FORM_SCHEMA = z.object({
  surface: baseField.step(0.1),
  runoff: z.nativeEnum(RUNOFF),
  location,
});

export type WaterHarvestFormValues = z.infer<typeof WATER_HARVEST_FORM_SCHEMA>;
export type WaterHarvestFormResponse = { rainfall: number };

export const useFormAction = formAction$<
  WaterHarvestFormValues,
  WaterHarvestFormResponse
>(async (values) => {
  // Runs on server
  const { location } = values;
  const stats = await getRainfall({ ...location, type: Type.LastYearAvg });
  return {
    status: "success",
    data: {
      rainfall: stats.daily.precipitation_sum.reduce((a, b) => a! + b!, 0) || 0,
    },
  };
}, zodForm$(WATER_HARVEST_FORM_SCHEMA));

export type WaterHarvestFormStore = FormStore<
  WaterHarvestFormValues,
  WaterHarvestFormResponse
>;
