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
  }: PageProps<Extract<KcContext, { pageId: 'login-reset-otp.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, messagesPerField, configuredOtpCredentials } = kcContext;

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
    id="kc-otp-reset-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcInputWrapperClass')}>
      <div class={kcClsx('kcInfoAreaWrapperClass')}>
        <p id="kc-otp-reset-form-description">{msg('otp-reset-description')}</p>
        {#each configuredOtpCredentials.userOtpCredentials as otpCredential, index}
          <input
            id={`kc-otp-credential-${index}`}
            class={kcClsx('kcLoginOTPListInputClass')}
            type="radio"
            name="selectedCredentialId"
            value={otpCredential.id}
            checked={otpCredential.id === configuredOtpCredentials.selectedCredentialId}
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
        <div class={kcClsx('kcFormGroupClass')}>
          <div
            id="kc-form-buttons"
            class={kcClsx('kcFormButtonsClass')}
          >
            <input
              id="kc-otp-reset-form-submit"
              class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
              type="submit"
              value={msgStr('doSubmit')}
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</Template>
