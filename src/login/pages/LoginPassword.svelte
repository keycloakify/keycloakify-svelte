<script lang="ts">
  import PasswordWrapper from '@keycloakify/svelte/login/components/PasswordWrapper.svelte';
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { useState } from '@keycloakify/svelte/tools/useState';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import { untrack } from 'svelte';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';
  import { useScript } from './LoginPassword.useScript';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login-password.ftl' }>, I18n> = $props();

  const { kcClsx } = $derived(
    getKcClsx({
      doUseDefaultCss,
      classes,
    }),
  );

  const { realm, url, messagesPerField, enableWebAuthnConditionalUI, authenticators } = $derived(kcContext);

  const { msg, msgStr } = $derived($i18n);

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  const webAuthnButtonId = 'authenticateWebAuthnButton';

  useScript({
    webAuthnButtonId,
    kcContext: untrack(() => kcContext),
    i18n: untrack(() => i18n),
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError('password')}
>
  {#snippet headerNode()}
    {@render msg('doLogIn')()}
  {/snippet}

  <div id="kc-form">
    <div id="kc-form-wrapper">
      <form
        id="kc-form-login"
        onsubmit={() => {
          setIsLoginButtonDisabled(true);
          return true;
        }}
        action={url.loginAction}
        method="post"
      >
        <div class={clsx(kcClsx('kcFormGroupClass'), 'no-bottom-margin')}>
          <hr />
          <label
            for="password"
            class={kcClsx('kcLabelClass')}
          >
            {@render msg('password')()}
          </label>

          <PasswordWrapper
            {kcClsx}
            {i18n}
            passwordInputId="password"
          >
            <!-- svelte-ignore a11y_autofocus -->
            <input
              tabindex={2}
              id="password"
              class={kcClsx('kcInputClass')}
              name="password"
              type="password"
              autofocus
              autocomplete="on"
              aria-invalid={messagesPerField.existsError('username', 'password')}
            />
          </PasswordWrapper>

          {#if messagesPerField.existsError('password')}
            <span
              id="input-error-password"
              class={kcClsx('kcInputErrorMessageClass')}
              aria-live="polite">{@html kcSanitize(messagesPerField.get('password'))}</span
            >
          {/if}
        </div>
        <div class={kcClsx('kcFormGroupClass', 'kcFormSettingClass')}>
          <div id="kc-form-options"></div>
          <div class={kcClsx('kcFormOptionsWrapperClass')}>
            {#if realm.resetPasswordAllowed}
              <span>
                <a
                  tabindex={5}
                  href={url.loginResetCredentialsUrl}
                >
                  {@render msg('doForgotPassword')()}
                </a>
              </span>
            {/if}
          </div>
        </div>
        <div
          id="kc-form-buttons"
          class={kcClsx('kcFormGroupClass')}
        >
          <input
            tabindex={4}
            class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
            name="login"
            id="kc-login"
            type="submit"
            value={msgStr('doLogIn')}
            disabled={$isLoginButtonDisabled}
          />
        </div>
      </form>
    </div>
  </div>
  {#if enableWebAuthnConditionalUI}
    <form
      id="webauth"
      action={url.loginAction}
      method="post"
    >
      <input
        type="hidden"
        id="clientDataJSON"
        name="clientDataJSON"
      />
      <input
        type="hidden"
        id="authenticatorData"
        name="authenticatorData"
      />
      <input
        type="hidden"
        id="signature"
        name="signature"
      />
      <input
        type="hidden"
        id="credentialId"
        name="credentialId"
      />
      <input
        type="hidden"
        id="userHandle"
        name="userHandle"
      />
      <input
        type="hidden"
        id="error"
        name="error"
      />
    </form>

    {#if authenticators !== undefined && authenticators.authenticators.length !== 0}
      <form
        id="authn_select"
        class={kcClsx('kcFormClass')}
      >
        {#each authenticators.authenticators as authenticator (authenticator.credentialId)}
          <input
            type="hidden"
            name="authn_use_chk"
            readOnly
            value={authenticator.credentialId}
          />
        {/each}
      </form>
    {/if}
    <br />

    <input
      id={webAuthnButtonId}
      type="button"
      class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
      value={msgStr('passkey-doAuthenticate')}
    />
  {/if}
</Template>
