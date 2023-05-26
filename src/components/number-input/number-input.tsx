import {
  component$,
  useSignal,
  type PropFunction,
  type QwikChangeEvent,
  type QwikFocusEvent,
  useTask$,
} from "@builder.io/qwik";
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
  ref: PropFunction<(element: Element) => void>;
  onInput$: PropFunction<(event: Event, element: HTMLInputElement) => void>;
  onChange$: PropFunction<
    (
      event: QwikChangeEvent<HTMLInputElement>,
      element: HTMLInputElement
    ) => void
  >;
  onBlur$: PropFunction<
    (event: QwikFocusEvent<HTMLInputElement>, element: HTMLInputElement) => void
  >;
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
    const ariaProps = useSignal({});

    useTask$(({ track }) => {
      track(() => error);
      track(() => dirty);
      ariaProps.value = error ? { "aria-invalid": true } : {};
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
  }
);
