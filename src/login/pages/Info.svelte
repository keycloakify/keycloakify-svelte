<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'info.ftl' }>, I18n> = $props();

  const { advancedMsgStr, msg } = i18n;

  const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={false}
>
  {#snippet headerNode()}
    <span>{@html kcSanitize(messageHeader ?? message.summary)}</span>
  {/snippet}

  <div id="kc-info-message">
    <p class="instruction">
      {@html kcSanitize(
        (() => {
          let html = message.summary;

          if (requiredActions) {
            html += '<b>';

            html += requiredActions
              .map((requiredAction) => advancedMsgStr(`requiredAction.${requiredAction}`))
              .join(', ');

            html += '</b>';
          }

          return html;
        })(),
      )}
    </p>
    {#if !skipLink}
      {#if pageRedirectUri}
        <p>
          <a href={pageRedirectUri}>{@render msg('backToApplication')()}</a>
        </p>
      {:else if actionUri}
        <p>
          <a href={actionUri}>{@render msg('proceedWithAction')()}</a>
        </p>
      {:else if client.baseUrl}<p>
          <a href={client.baseUrl}>{@render msg('backToApplication')()}</a>
        </p>
      {/if}
    {/if}
  </div>
</Template>
