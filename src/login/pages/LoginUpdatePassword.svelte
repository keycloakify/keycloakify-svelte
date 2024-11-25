<script lang="ts">
  import LogoutOtherSessions from '@keycloakify/svelte/login/components/LogoutOtherSessions.svelte';
  import PasswordWrapper from '@keycloakify/svelte/login/components/PasswordWrapper.svelte';
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login-update-password.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { msg, msgStr } = $i18n;

  const { url, messagesPerField, isAppInitiatedAction } = kcContext;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError('password', 'password-confirm')}
>
  {#snippet headerNode()}
    {@render msg('updatePasswordTitle')()}
  {/snippet}
  <form
    id="kc-passwd-update-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          for="password-new"
          class={kcClsx('kcLabelClass')}
        >
          {@render msg('passwordNew')()}
        </label>
      </div>
      <div class={kcClsx('kcInputWrapperClass')}>
        <PasswordWrapper
          {kcClsx}
          {i18n}
          passwordInputId="password-new"
        >
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="password"
            id="password-new"
            name="password-new"
            class={kcClsx('kcInputClass')}
            autofocus
            autocomplete="new-password"
            aria-invalid={messagesPerField.existsError('password', 'password-confirm')}
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
    </div>

    <div class={kcClsx('kcFormGroupClass')}>
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          for="password-confirm"
          class={kcClsx('kcLabelClass')}
        >
          {@render msg('passwordConfirm')()}
        </label>
      </div>
      <div class={kcClsx('kcInputWrapperClass')}>
        <PasswordWrapper
          {kcClsx}
          {i18n}
          passwordInputId="password-confirm"
        >
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="password"
            id="password-confirm"
            name="password-confirm"
            class={kcClsx('kcInputClass')}
            autofocus
            autocomplete="new-password"
            aria-invalid={messagesPerField.existsError('password', 'password-confirm')}
          />
        </PasswordWrapper>

        {#if messagesPerField.existsError('password-confirm')}
          <span
            id="input-error-password-confirm"
            class={kcClsx('kcInputErrorMessageClass')}
            aria-live="polite">{@html kcSanitize(messagesPerField.get('password-confirm'))}</span
          >
        {/if}
      </div>
    </div>
    <div class={kcClsx('kcFormGroupClass')}>
      <LogoutOtherSessions
        {kcClsx}
        {i18n}
      />
      <div
        id="kc-form-buttons"
        class={kcClsx('kcFormButtonsClass')}
      >
        <input
          class={kcClsx(
            'kcButtonClass',
            'kcButtonPrimaryClass',
            !isAppInitiatedAction && 'kcButtonBlockClass',
            'kcButtonLargeClass',
          )}
          type="submit"
          value={msgStr('doSubmit')}
        />
        {#if isAppInitiatedAction}
          <button
            class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
            type="submit"
            name="cancel-aia"
            value="true"
          >
            {@render msg('doCancel')()}
          </button>
        {/if}
      </div>
    </div>
  </form>
</Template>
