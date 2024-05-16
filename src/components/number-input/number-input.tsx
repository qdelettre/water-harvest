import type { QRL } from "@builder.io/qwik";
import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { InputLabel } from "../input-label/input-label";
import { Hint } from "../hint/hint";
import { FormError } from "~/styled/form-error/form-error.css";

type NumberInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  value: number | undefined;
  error: string;
  required?: boolean;
  step?: number;
  dirty?: boolean;
  hint?: string;
  min?: number;
  ref: QRL<(element: HTMLInputElement) => void>;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
};

export const NumberInput = component$(
  ({
    label,
    error,
    name,
    dirty,
    required,
    hint,
    ...props
  }: NumberInputProps) => {
    const ariaProps = useSignal<Record<string, unknown>>({});

    useTask$(({ track }) => {
      track(() => error);
      track(() => dirty);
      if (ariaProps.value["aria-invalid"] && !error) {
        ariaProps.value = { "aria-invalid": false };
      } else {
        ariaProps.value = error.length ? { "aria-invalid": true } : {};
      }
    });

    return (
      <>
        <InputLabel name={name} label={label} required={required} />

        <input
          {...props}
          autoComplete="off"
          id={name}
          type="number"
          aria-label={label}
          {...ariaProps.value}
        />
        {hint && <Hint hint={hint} />}
        {error && <FormError>{error}</FormError>}
      </>
    );
  },
);
