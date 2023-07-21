import { component$ } from "@builder.io/qwik";

type InputLabelProps = {
  name: string;
  label?: string;
  required?: boolean;
};

export const InputLabel = component$(
  ({ name, label, required }: InputLabelProps) => (
    <>
      {label && (
        <label for={name}>
          {label} {required && <span>*</span>}
        </label>
      )}
    </>
  ),
);
