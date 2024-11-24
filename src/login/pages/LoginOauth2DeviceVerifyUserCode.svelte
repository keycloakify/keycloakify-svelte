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
  }: PageProps<Extract<KcContext, { pageId: 'login-oauth2-device-verify-user-code.ftl' }>, I18n> = $props();

  const { url } = kcContext;

  const { msg, msgStr } = i18n;

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
>
  {#snippet headerNode()}
    {@render msg('oauth2DeviceVerificationTitle')()}
  {/snippet}
  <form
    id="kc-user-verify-device-user-code-form"
    class={kcClsx('kcFormClass')}
    action={url.oauth2DeviceVerificationAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          for="device-user-code"
          class={kcClsx('kcLabelClass')}
        >
          {@render msg('verifyOAuth2DeviceUserCode')()}
        </label>
      </div>

      <div class={kcClsx('kcInputWrapperClass')}>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id="device-user-code"
          name="device_user_code"
          autoComplete="off"
          type="text"
          class={kcClsx('kcInputClass')}
          autofocus
        />
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
        <div class={kcClsx('kcFormButtonsWrapperClass')}>
          <input
            class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
            type="submit"
            value={msgStr('doSubmit')}
          />
        </div>
      </div>
    </div>
  </form>
</Template>
