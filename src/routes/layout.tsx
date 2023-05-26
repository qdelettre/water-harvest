import { component$, Slot, useStyles$ } from "@builder.io/qwik";

import styles from "./styles.css?inline";
import { QwikLogo } from "~/components/qwik-logo/qwik-logo";

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <main class="container">
        <Slot />
        <footer>
          <a class="secondary" href="https://open-meteo.com/">
            Weather data by Open-Meteo.com
          </a>
          <a
            href="https://github.com/qdelettre/water-harvest"
            target="_blank"
            class="primary"
          >
            Made with <span class="heart">♡</span> with <QwikLogo /> & Pico.css
          </a>
        </footer>
      </main>
    </>
  );
});
