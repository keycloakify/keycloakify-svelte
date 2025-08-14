<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login-page-expired.ftl' }>, I18n> = $props();

  const { url } = kcContext;

  const { msg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {@render msg('pageExpiredTitle')()}
  {/snippet}

  <p
    id="instruction1"
    class="instruction"
  >
    {@render msg('pageExpiredMsg1')()}
    <a
      id="loginRestartLink"
      href={url.loginRestartFlowUrl}
    >
      {@render msg('doClickHere')()}
    </a>&nbsp;.<br />
    {@render msg('pageExpiredMsg2')()}&nbsp;
    <a
      id="loginContinueLink"
      href={url.loginAction}
    >
      {@render msg('doClickHere')()}
    </a>&nbsp;.
  </p>
</Template>
