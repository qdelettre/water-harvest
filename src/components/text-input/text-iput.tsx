import type {
  PropFunction,
  QwikChangeEvent,
  QwikFocusEvent,
} from "@builder.io/qwik";
import { useSignal, useTask$ } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { FormError } from "~/styled/form-error/form-error.css";
import { Hint } from "../hint/hint";

type TextInputProps = {
  name: string;
  type: "text" | "email" | "tel" | "password" | "url" | "date";
  label?: string;
  placeholder?: string;
  hint?: string;
  value: string | undefined;
  dirty?: boolean;
  error: string;
  required?: boolean;
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

export const TextInput = component$(
  ({ label, error, dirty, hint, name, required, ...props }: TextInputProps) => {
    const ariaProps = useSignal<Record<string, unknown>>({});

    useTask$(({ track }) => {
      track(() => error);
      track(() => dirty);
      if (ariaProps.value["aria-invalid"] && !error) {
        ariaProps.value = { "aria-invalid": false };
      } else {
        ariaProps.value = error?.length ? { "aria-invalid": true } : {};
      }
    });

    return (
      <div>
        {label && (
          <label for={name}>
            {label} {required && <span>*</span>}
          </label>
        )}
        <input {...props} id={name} aria-label={label} {...ariaProps.value} />
        {hint && <Hint hint={hint} />}
        {error && <FormError>{error}</FormError>}
      </div>
    );
  }
);
