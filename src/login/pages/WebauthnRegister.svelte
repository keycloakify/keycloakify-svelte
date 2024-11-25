<script lang="ts">
  import LogoutOtherSessions from '@keycloakify/svelte/login/components/LogoutOtherSessions.svelte';
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { useScript } from '@keycloakify/svelte/login/pages/WebauthnRegister.useScript';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'webauthn-register.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { url, isSetRetry, isAppInitiatedAction } = kcContext;

  const { msg, msgStr } = $i18n;

  const authButtonId = 'authenticateWebAuthnButton';

  useScript({
    authButtonId,
    kcContext,
    i18n,
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    <span class={kcClsx('kcWebAuthnKeyIcon')}></span>
    {@render msg('webauthn-registration-title')()}
  {/snippet}
  <form
    id="register"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <input
        type="hidden"
        id="clientDataJSON"
        name="clientDataJSON"
      />
      <input
        type="hidden"
        id="attestationObject"
        name="attestationObject"
      />
      <input
        type="hidden"
        id="publicKeyCredentialId"
        name="publicKeyCredentialId"
      />
      <input
        type="hidden"
        id="authenticatorLabel"
        name="authenticatorLabel"
      />
      <input
        type="hidden"
        id="transports"
        name="transports"
      />
      <input
        type="hidden"
        id="error"
        name="error"
      />
      <LogoutOtherSessions
        {kcClsx}
        {i18n}
      />
    </div>
  </form>
  <input
    type="submit"
    class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
    id={authButtonId}
    value={msgStr('doRegisterSecurityKey')}
  />
  {#if !isSetRetry && isAppInitiatedAction}
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
        {@render msg('doCancel')()}
      </button>
    </form>
  {/if}
</Template>
