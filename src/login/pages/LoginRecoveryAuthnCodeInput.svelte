<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login-recovery-authn-code-input.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError('recoveryCodeInput')}
>
  {#snippet headerNode()}
    {@render msg('auth-recovery-code-header')()}
  {/snippet}
  <form
    id="kc-recovery-code-login-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          for="recoveryCodeInput"
          class={kcClsx('kcLabelClass')}
        >
          {@render msg('auth-recovery-code-prompt', `${recoveryAuthnCodesInputBean.codeNumber}`)()}
        </label>
      </div>
      <div class={kcClsx('kcInputWrapperClass')}>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          tabindex={1}
          id="recoveryCodeInput"
          name="recoveryCodeInput"
          aria-invalid={messagesPerField.existsError('recoveryCodeInput')}
          autocomplete="off"
          type="text"
          class={kcClsx('kcInputClass')}
          autofocus
        />
        {#if messagesPerField.existsError('recoveryCodeInput')}
          <span
            id="input-error"
            class={kcClsx('kcInputErrorMessageClass')}
            aria-live="polite">{@html kcSanitize(messagesPerField.get('recoveryCodeInput'))}</span
          >
        {/if}
      </div>
    </div>

    <div class={kcClsx('kcFormGroupClass')}>
      <div
        id="kc-form-options"
        class={kcClsx('kcFormOptionsWrapperClass')}
      >
        <div class={kcClsx('kcFormOptionsWrapperClass')}></div>
      </div>
      <div
        id="kc-form-buttons"
        class={kcClsx('kcFormButtonsClass')}
      >
        <input
          class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
          name="login"
          id="kc-login"
          type="submit"
          value={msgStr('doLogIn')}
        />
      </div>
    </div>
  </form>
</Template>
