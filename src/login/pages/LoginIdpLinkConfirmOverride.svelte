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
  }: PageProps<Extract<KcContext, { pageId: 'login-idp-link-confirm-override.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, idpDisplayName } = kcContext;

  const { msg } = i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {@render msg('confirmOverrideIdpTitle')()}
  {/snippet}

  <form
    id="kc-register-form"
    action={url.loginAction}
    method="post"
  >
    {@render msg('pageExpiredMsg1')()}{' '}
    <a
      id="loginRestartLink"
      href={url.loginRestartFlowUrl}
    >
      {@render msg('doClickHere')()}
    </a>
    <br />
    <br />
    <button
      type="submit"
      class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
      name="submitAction"
      id="confirmOverride"
      value="confirmOverride"
    >
      {@render msg('confirmOverrideIdpContinue', idpDisplayName)()}
    </button>
  </form>
</Template>
