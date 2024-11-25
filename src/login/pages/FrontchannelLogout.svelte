<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { onMount } from 'svelte';
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

  onMount(() => {
    if (logout.logoutRedirectUri) {
      window.location.replace(logout.logoutRedirectUri);
    }
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
    {#each logout.clients as client}
      <li>
        {client.name}
        <!-- svelte-ignore a11y_missing_attribute -->
        <iframe
          src={client.frontChannelLogoutUrl}
          style:display={'none'}
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
