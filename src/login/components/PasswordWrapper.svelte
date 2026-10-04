<script lang="ts">
  import { useReducer } from '#keycloakify-svelte/tools/useReducer.js';
  import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
  import { assert } from 'keycloakify/tools/assert';
  import { onMount, type Snippet } from 'svelte';
  import type { I18n } from '../i18n';
  import type { Readable } from 'svelte/store';

  const props: {
    kcClsx: KcClsx;
    i18n: Readable<I18n>;
    passwordInputId: string;
    tabindex?: number;
    children: Snippet;
  } = $props();
  const { kcClsx, i18n, passwordInputId, tabindex, children } = $derived(props);

  const { msgStr } = $derived($i18n);

  const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer<boolean, boolean>(
    (isPasswordRevealed: boolean) => !isPasswordRevealed,
    false,
  );
  onMount(() => {
    const unsubscribe = isPasswordRevealed.subscribe(($isPasswordRevealed) => {
      const passwordInputElement: HTMLInputElement = document.getElementById(passwordInputId) as HTMLInputElement;

      assert(passwordInputElement instanceof HTMLInputElement);
      passwordInputElement.type = $isPasswordRevealed ? 'text' : 'password';
    });
    return () => unsubscribe();
  });
</script>

<div class={kcClsx('kcInputGroup')}>
  {@render children?.()}
  <button
    type="button"
    class={kcClsx('kcFormPasswordVisibilityButtonClass')}
    aria-label={msgStr($isPasswordRevealed ? 'hidePassword' : 'showPassword')}
    aria-controls={passwordInputId}
    onclick={() => toggleIsPasswordRevealed($isPasswordRevealed)}
    {tabindex}
  >
    <i
      class={kcClsx($isPasswordRevealed ? 'kcFormPasswordVisibilityIconHide' : 'kcFormPasswordVisibilityIconShow')}
      aria-hidden="true"
    ></i>
  </button>
</div>
