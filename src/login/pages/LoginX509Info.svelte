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
  }: PageProps<Extract<KcContext, { pageId: 'login-x509-info.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, x509 } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {@render msg('doLogIn')()}
  {/snippet}
  <form
    id="kc-x509-login-info"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          for="certificate_subjectDN"
          class={kcClsx('kcLabelClass')}
        >
          {@render msg('clientCertificate')()}
        </label>
      </div>
      {#if x509.formData.subjectDN}
        <div class={kcClsx('kcLabelWrapperClass')}>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label
            id="certificate_subjectDN"
            class={kcClsx('kcLabelClass')}
          >
            {x509.formData.subjectDN}
          </label>
        </div>
      {:else}
        <div class={kcClsx('kcLabelWrapperClass')}>
          <label
            id="certificate_subjectDN"
            class={kcClsx('kcLabelClass')}
          >
            {@render msg('noCertificate')()}
          </label>
        </div>
      {/if}
    </div>
    <div class={kcClsx('kcFormGroupClass')}>
      {#if x509.formData.isUserEnabled}
        <div class={kcClsx('kcLabelWrapperClass')}>
          <label
            for="username"
            class={kcClsx('kcLabelClass')}
          >
            {msg('doX509Login')}
          </label>
        </div>
        <div class={kcClsx('kcLabelWrapperClass')}>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label
            id="username"
            class={kcClsx('kcLabelClass')}
          >
            {x509.formData.username}
          </label>
        </div>
      {/if}
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
            name="login"
            id="kc-login"
            type="submit"
            value={msgStr('doContinue')}
          />
          {#if x509.formData.isUserEnabled}
            <input
              class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
              name="cancel"
              id="kc-cancel"
              type="submit"
              value={msgStr('doIgnore')}
            />
          {/if}
        </div>
      </div>
    </div>
  </form>
</Template>
