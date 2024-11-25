<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';
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

  const { msg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {#if code.success}
      {@render msg('codeSuccessTitle')()}
    {:else}
      {@render msg('codeErrorTitle', code.error)()}
    {/if}
  {/snippet}
  <div id="kc-code">
    {#if code.success}
      <p>{@render msg('copyCodeInstruction')()}</p>
      <input
        id="code"
        class={kcClsx('kcTextareaClass')}
        value={code.code}
      />
    {:else if code.error}
      <p id="error">{@html kcSanitize(code.error)}</p>
    {/if}
  </div>
</Template>
