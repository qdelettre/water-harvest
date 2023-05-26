import { component$ } from "@builder.io/qwik";

export interface HintProps {
  hint: string;
}

export const Hint = component$<HintProps>(({ hint }) => {
  return <small>{hint}</small>;
});
