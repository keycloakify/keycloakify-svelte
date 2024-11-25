<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import type { I18n } from './i18n';
  import type { KcContext } from './KcContext';

  const props: PageProps<KcContext, I18n> = $props();
  const { kcContext: kcContext, ...rest } = props;
  const loadComponent = () => {
    switch (kcContext.pageId) {
      case 'password.ftl':
        return import('@keycloakify/svelte/account/pages/Password.svelte');

      case 'sessions.ftl':
        return import('@keycloakify/svelte/account/pages/Sessions.svelte');

      case 'account.ftl':
        return import('@keycloakify/svelte/account/pages/Account.svelte');

      case 'totp.ftl':
        return import('@keycloakify/svelte/account/pages/Totp.svelte');

      case 'applications.ftl':
        return import('@keycloakify/svelte/account/pages/Applications.svelte');

      case 'log.ftl':
        return import('@keycloakify/svelte/account/pages/Log.svelte');

      case 'federatedIdentity.ftl':
        return import('@keycloakify/svelte/account/pages/FederatedIdentity.svelte');
    }
  };
  const lazyComponent = loadComponent();
</script>

{#if lazyComponent}
  {#await lazyComponent then { default: LazyComponent }}
    <LazyComponent
      kcContext={kcContext as never}
      {...rest}
    />
  {/await}
{/if}
