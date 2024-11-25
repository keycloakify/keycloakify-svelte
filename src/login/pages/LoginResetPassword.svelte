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
  }: PageProps<Extract<KcContext, { pageId: 'login-reset-password.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, realm, auth, messagesPerField } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayInfo={true}
  displayMessage={!messagesPerField.existsError('username')}
>
  {#snippet headerNode()}
    {@render msg('emailForgotTitle')()}
  {/snippet}
  {#snippet infoNode()}
    {#if realm.duplicateEmailsAllowed}
      {@render msg('emailInstructionUsername')()}
    {:else}
      {@render msg('emailInstruction')()}
    {/if}
  {/snippet}
  <form
    id="kc-reset-password-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          for="username"
          class={kcClsx('kcLabelClass')}
        >
          {#if !realm.loginWithEmailAllowed}
            {@render msg('username')()}
          {:else if !realm.registrationEmailAsUsername}
            {@render msg('usernameOrEmail')()}
          {:else}
            {@render msg('email')()}
          {/if}
        </label>
      </div>
      <div class={kcClsx('kcInputWrapperClass')}>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          id="username"
          name="username"
          class={kcClsx('kcInputClass')}
          autofocus
          value={auth.attemptedUsername ?? ''}
          aria-invalid={messagesPerField.existsError('username')}
        />
        {#if messagesPerField.existsError('username')}
          <span
            id="input-error-username"
            class={kcClsx('kcInputErrorMessageClass')}
            aria-live="polite">{@html kcSanitize(messagesPerField.get('username'))}</span
          >
        {/if}
      </div>
    </div>
    <div class={kcClsx('kcFormGroupClass', 'kcFormSettingClass')}>
      <div
        id="kc-form-options"
        class={kcClsx('kcFormOptionsClass')}
      >
        <div class={kcClsx('kcFormOptionsWrapperClass')}>
          <span>
            <a href={url.loginUrl}>{@render msg('backToLogin')()}</a>
          </span>
        </div>
      </div>

      <div
        id="kc-form-buttons"
        class={kcClsx('kcFormButtonsClass')}
      >
        <input
          class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
          type="submit"
          value={msgStr('doSubmit')}
        />
      </div>
    </div>
  </form>
</Template>
