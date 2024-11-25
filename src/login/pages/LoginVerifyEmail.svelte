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
  }: PageProps<Extract<KcContext, { pageId: 'login-verify-email.ftl' }>, I18n> = $props();

  const { msg } = $i18n;

  const { url, user } = kcContext;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayInfo={true}
>
  {#snippet headerNode()}
    {@render msg('emailVerifyTitle')()}
  {/snippet}
  {#snippet infoNode()}
    <p class="instruction">
      {@render msg('emailVerifyInstruction2')()}
      <br />
      <a href={url.loginAction}>{@render msg('doClickHere')()}</a>
      &nbsp;
      {@render msg('emailVerifyInstruction3')()}
    </p>
  {/snippet}
  <p class="instruction">{@render msg('emailVerifyInstruction1', user?.email ?? '')()}</p>
</Template>
