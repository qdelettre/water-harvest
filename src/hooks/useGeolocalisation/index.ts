import type { Signal } from "@builder.io/qwik";
import { useSignal, useVisibleTask$ } from "@builder.io/qwik";

type HookReturnType = {
  isSupported: Signal<Boolean>;
  hasError: Signal<Boolean>;
  position: Signal<[number, number] | undefined>;
};

export function useGeolocalisation(): HookReturnType {
  const isSupported = useSignal(true);
  const hasError = useSignal(false);
  const position = useSignal<[number, number]>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    () => {
      const navigator = window.navigator;
      isSupported.value = !!navigator.geolocation;

      function success({ coords }: GeolocationPosition) {
        position.value = [coords.latitude, coords.longitude];
      }

      function error() {
        hasError.value = true;
      }

      navigator.geolocation.getCurrentPosition(success, error);
    },
    {
      strategy: "document-ready",
    },
  );

  return {
    isSupported,
    hasError,
    position,
  };
}
