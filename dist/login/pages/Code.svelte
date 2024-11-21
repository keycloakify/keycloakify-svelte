<script lang="ts">
  import type { PageProps } from './PageProps';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const props: PageProps<Extract<KcContext, { pageId: 'code.ftl' }>, I18n> = $props();
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { code } = kcContext;

  const { msgStr } = i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {#if code.success}
      {msgStr('codeSuccessTitle')}
    {:else}
      {msgStr('codeErrorTitle', code.error)}
    {/if}
  {/snippet}
  <div id="kc-code">
    {#if code.success}
      <p>{msgStr('copyCodeInstruction')}</p>
      <input
        id="code"
        class={kcClsx('kcTextareaClass')}
        value={code.code}
      />
    {:else if code.error}
      <p id="error">{@html code.error}</p>
    {/if}
  </div>
</Template>
