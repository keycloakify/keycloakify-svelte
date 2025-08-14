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
  }: PageProps<Extract<KcContext, { pageId: 'login-otp.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { otpLogin, url, messagesPerField } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError('totp')}
>
  {#snippet headerNode()}
    {@render msg('doLogIn')()}
  {/snippet}
  <form
    id="kc-otp-login-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    {#if otpLogin.userOtpCredentials.length > 1}
      <div class={kcClsx('kcFormGroupClass')}>
        <div class={kcClsx('kcInputWrapperClass')}>
          {#each otpLogin.userOtpCredentials as otpCredential, index (otpCredential.id)}
            <input
              id={`kc-otp-credential-${index}`}
              class={kcClsx('kcLoginOTPListInputClass')}
              type="radio"
              name="selectedCredentialId"
              value={otpCredential.id}
              checked={otpCredential.id === otpLogin.selectedCredentialId}
            />
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <label
              for={`kc-otp-credential-${index}`}
              class={kcClsx('kcLoginOTPListClass')}
              tabindex={index}
            >
              <span class={kcClsx('kcLoginOTPListItemHeaderClass')}>
                <span class={kcClsx('kcLoginOTPListItemIconBodyClass')}>
                  <i
                    class={kcClsx('kcLoginOTPListItemIconClass')}
                    aria-hidden="true"
                  ></i>
                </span>
                <span class={kcClsx('kcLoginOTPListItemTitleClass')}>{otpCredential.userLabel}</span>
              </span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    <div class={kcClsx('kcFormGroupClass')}>
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          for="otp"
          class={kcClsx('kcLabelClass')}
        >
          {@render msg('loginOtpOneTime')()}
        </label>
      </div>
      <div class={kcClsx('kcInputWrapperClass')}>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id="otp"
          name="otp"
          autocomplete="off"
          type="text"
          class={kcClsx('kcInputClass')}
          autofocus
          aria-invalid={messagesPerField.existsError('totp')}
        />
        {#if messagesPerField.existsError('totp')}
          <span
            id="input-error-otp-code"
            class={kcClsx('kcInputErrorMessageClass')}
            aria-live="polite"
          >
            {@html kcSanitize(messagesPerField.get('totp'))}
          </span>
        {/if}
      </div>
    </div>

    <div class={kcClsx('kcFormGroupClass')}>
      <div
        id="kc-form-options"
        class={kcClsx('kcFormOptionsClass')}
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
