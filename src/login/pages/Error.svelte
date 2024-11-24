<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'error.ftl' }>, I18n> = $props();

  const { message, client, skipLink } = kcContext;

  const { msg } = i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={false}
>
  {#snippet headerNode()}
    {@render msg('errorTitle')()}
  {/snippet}
  <div id="kc-error-message">
    <p class="instruction">{@html kcSanitize(message.summary)}</p>
    {#if !skipLink && client !== undefined && client.baseUrl !== undefined}
      <p>
        <a
          id="backToApplication"
          href={client.baseUrl}
        >
          {@render msg('backToApplication')()}
        </a>
      </p>
    {/if}
  </div>
</Template>
