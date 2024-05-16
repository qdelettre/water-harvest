import type { QRL } from "@builder.io/qwik";
import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { InputLabel } from "../input-label/input-label";
import { Hint } from "../hint/hint";
import { FormError } from "~/styled/form-error/form-error.css";

type SelectProps = {
  ref: QRL<(element: HTMLSelectElement) => void>;
  name: string;
  value: string | string[] | null | undefined;
  onInput$: (event: Event, element: HTMLSelectElement) => void;
  onChange$: (event: Event, element: HTMLSelectElement) => void;
  onBlur$: (event: Event, element: HTMLSelectElement) => void;
  options: { label: string; value: string }[];
  multiple?: boolean;
  size?: number;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  dirty?: boolean;
  hint?: string;
};

export const Select = component$(
  ({ value, options, error, ...props }: SelectProps) => {
    const { name, dirty, required, label, placeholder, hint } = props;

    // Create computed value of selected values
    const values = useSignal<string[]>();
    useTask$(({ track }) => {
      track(() => value);
      if (Array.isArray(value)) {
        values.value = value;
      } else if (value && typeof value === "string") {
        values.value = [value];
      } else {
        values.value = [];
      }
    });

    return (
      <>
        <InputLabel name={name} label={label} required={required} />

        <select
          {...props}
          id={name}
          {...{
            ...(dirty && error && { "aria-invalid": true }),
          }}
        >
          <option value="" disabled hidden selected={!value}>
            {placeholder}
          </option>
          {options.map(({ label, value }) => (
            <option
              key={value}
              value={value}
              selected={values.value?.includes(value)}
            >
              {label}
            </option>
          ))}
        </select>
        {hint && <Hint hint={hint} />}
        {error && <FormError>{error}</FormError>}
      </>
    );
  },
);
