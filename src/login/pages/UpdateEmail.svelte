<script lang="ts">
  import LogoutOtherSessions from '@keycloakify/svelte/login/components/LogoutOtherSessions.svelte';
  import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { useState } from '@keycloakify/svelte/tools/useState';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { Component } from 'svelte';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';

  type UpdateEmailProps = PageProps<Extract<KcContext, { pageId: 'update-email.ftl' }>, I18n> & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  }: UpdateEmailProps = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { msg, msgStr } = $i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);

  const { url, messagesPerField, isAppInitiatedAction } = kcContext;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={messagesPerField.exists('global')}
  displayRequiredFields={true}
>
  {#snippet headerNode()}
    {@render msg('updateEmailTitle')()}
  {/snippet}
  <form
    id="kc-update-email-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <UserProfileFormFields
      {kcContext}
      {i18n}
      {kcClsx}
      onIsFormSubmittableValueChange={setIsFormSubmittable}
      {doMakeUserConfirmPassword}
    />

    <div class={kcClsx('kcFormGroupClass')}>
      <div
        id="kc-form-options"
        class={kcClsx('kcFormOptionsClass')}
      >
        <div class={kcClsx('kcFormOptionsWrapperClass')}></div>
      </div>

      <LogoutOtherSessions
        {kcClsx}
        {i18n}
      />

      <div
        id="kc-form-buttons"
        class={kcClsx('kcFormButtonsClass')}
      >
        <input
          disabled={!$isFormSubmittable}
          class={kcClsx(
            'kcButtonClass',
            'kcButtonPrimaryClass',
            isAppInitiatedAction && 'kcButtonBlockClass',
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
