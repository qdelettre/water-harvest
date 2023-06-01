import { RUNOFF } from "~/constants/runoff";
import { z } from "zod";

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

export const dataFormSchema = z.object({
  surface: baseField.step(0.1),
  runoff: z.nativeEnum(RUNOFF),
  location,
});

export type DataForm = z.infer<typeof dataFormSchema>;
