<script lang="ts">
  import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { useState } from '@keycloakify/svelte/tools/useState';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { Component } from 'svelte';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: 'idp-review-user-profile.ftl' }>, I18n> & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  }: IdpReviewUserProfileProps = $props();
  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { msg, msgStr } = i18n;

  const { url, messagesPerField } = kcContext;

  const [isFomSubmittable, setIsFomSubmittable] = useState(false);
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
    {@render msg('loginIdpReviewProfileTitle')()}
  {/snippet}
  <form
    id="kc-idp-review-profile-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <UserProfileFormFields
      {kcContext}
      {i18n}
      onIsFormSubmittableValueChange={setIsFomSubmittable}
      {kcClsx}
      {doMakeUserConfirmPassword}
    />
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
          type="submit"
          value={msgStr('doSubmit')}
          disabled={!isFomSubmittable}
        />
      </div>
    </div>
  </form>
</Template>
