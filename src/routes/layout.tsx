import { component$, Slot, useStyles$ } from "@builder.io/qwik";

import styles from "./styles.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <nav class="container-fluid">
        <ul>
          <li>
            <a href="./" class="contrast">
              <strong>Water Harvest</strong>
            </a>
          </li>
        </ul>
      </nav>

      <main>
        <Slot />
      </main>
    </>
  );
});
