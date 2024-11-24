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
  }: PageProps<Extract<KcContext, { pageId: 'login-idp-link-confirm.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, idpAlias } = kcContext;

  const { msg } = i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {@render msg('confirmLinkIdpTitle')()}
  {/snippet}
  <form
    id="kc-register-form"
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <button
        type="submit"
        class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
        name="submitAction"
        id="updateProfile"
        value="updateProfile"
      >
        {@render msg('confirmLinkIdpReviewProfile')()}
      </button>
      <button
        type="submit"
        class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
        name="submitAction"
        id="linkAccount"
        value="linkAccount"
      >
        {@render msg('confirmLinkIdpContinue', idpAlias)()}
      </button>
    </div>
  </form>
</Template>
