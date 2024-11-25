<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';
  import { getKcClsx } from 'keycloakify/account/lib/kcClsx';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'log.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { log } = kcContext;

  const { msg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  active="log"
>
  <div class={kcClsx('kcContentWrapperClass')}>
    <div class="col-md-10">
      <h2>{@render msg('accountLogHtmlTitle')()}</h2>
    </div>

    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <td>{@render msg('date')()}</td>
          <td>{@render msg('event')()}</td>
          <td>{@render msg('ip')()}</td>
          <td>{@render msg('client')()}</td>
          <td>{@render msg('details')()}</td>
        </tr>
      </thead>

      <tbody>
        {#each log.events as event}
          <tr>
            <td>{event.date ? new Date(event.date).toLocaleString() : ''}</td>
            <td>{event.event}</td>
            <td>{event.ipAddress}</td>
            <td>{event.client || ''}</td>
            <td>
              {#each event.details as detail, detailIndex}
                <span>
                  {`${detail.key} = ${detail.value}`}
                  {#if detailIndex < event.details.length - 1},&nbsp;{/if}
                </span>
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Template>
