<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'webauthn-error.ftl' }>, I18n> = $props();

  const { url, isAppInitiatedAction } = kcContext;

  const { msg, msgStr } = $i18n;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={true}
>
  {#snippet headerNode()}
    {@render msg('webauthn-error-title')()}
  {/snippet}
  <form
    id="kc-error-credential-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <input
      type="hidden"
      id="executionValue"
      name="authenticationExecution"
    />
    <input
      type="hidden"
      id="isSetRetry"
      name="isSetRetry"
    />
  </form>
  <input
    tabindex={4}
    onclick={() => {
      // @ts-expect-error: Trusted Keycloak's code
      document.getElementById('isSetRetry').value = 'retry';
      // @ts-expect-error: Trusted Keycloak's code
      document.getElementById('executionValue').value = '${execution}';
      // @ts-expect-error: Trusted Keycloak's code
      document.getElementById('kc-error-credential-form').requestSubmit();
    }}
    type="button"
    class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
    name="try-again"
    id="kc-try-again"
    value={msgStr('doTryAgain')}
  />
  {#if isAppInitiatedAction}
    <form
      action={url.loginAction}
      class={kcClsx('kcFormClass')}
      id="kc-webauthn-settings-form"
      method="post"
    >
      <button
        type="submit"
        class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
        id="cancelWebAuthnAIA"
        name="cancel-aia"
        value="true"
      >
        {msgStr('doCancel')}
      </button>
    </form>
  {/if}
</Template>
