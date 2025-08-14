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
  }: PageProps<Extract<KcContext, { pageId: 'frontchannel-logout.ftl' }>, I18n> = $props();

  const { logout } = kcContext;

  const { msg, msgStr } = $i18n;
  let iframeLoadCount = $state(0);
  $effect(() => {
    if (!kcContext.logout.logoutRedirectUri) {
      return;
    }
    if (iframeLoadCount !== kcContext.logout.clients.length) {
      return;
    }
    window.location.replace(kcContext.logout.logoutRedirectUri);
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  documentTitle={msgStr('frontchannel-logout.title')}
>
  {#snippet headerNode()}
    {@render msg('frontchannel-logout.title')()}
  {/snippet}
  <p>{@render msg('frontchannel-logout.message')()}</p>
  <ul>
    {#each logout.clients as client (client.name)}
      <li>
        {client.name}
        <!-- svelte-ignore a11y_missing_attribute -->
        <iframe
          src={client.frontChannelLogoutUrl}
          style:display="none"
          onload={() => iframeLoadCount++}
        ></iframe>
      </li>{/each}
  </ul>
  {#if logout.logoutRedirectUri}
    <a
      id="continue"
      class="btn btn-primary"
      href={logout.logoutRedirectUri}
    >
      {@render msg('doContinue')()}
    </a>
  {/if}
</Template>
