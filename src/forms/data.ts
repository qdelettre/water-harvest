import { Runoff } from "~/constants/runoff";
import { z } from "zod";

const positiveErrorMessage = "Please enter a positive value";
const minErrorMessage = "Please enter a value superior to zero";

const baseField = z
  .number({
    required_error: "This field is required",
    invalid_type_error: "Please enter a number",
  })
  .positive(positiveErrorMessage)
  .min(0.1, minErrorMessage);

export const dataFormSchema = z.object({
  surface: baseField.step(0.1),
  rainfall: baseField,
  runoff: z.nativeEnum(Runoff),
});

export type DataForm = z.infer<typeof dataFormSchema>;
