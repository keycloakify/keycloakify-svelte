<script lang="ts">
  import UserProfileFormFields from '@keycloakify/svelte/account/components/UserProfileFormFields.svelte';
  import Template from '@keycloakify/svelte/account/Template.svelte';
  import type { KcContext } from 'keycloakify/account/KcContext';
  import type { ClassKey } from 'keycloakify/account/lib/kcClsx';
  import { useI18n } from './i18n';

  const { kcContext }: { kcContext: KcContext } = $props();

  const { i18n } = useI18n({ kcContext });
  const page = async () => {
    switch (kcContext.pageId) {
      default:
        return import('@keycloakify/svelte/account/DefaultPage.svelte');
    }
  };

  const classes = {} satisfies { [key in ClassKey]?: string };
  const doMakeUserConfirmPassword = true;
</script>

{#await page() then { default: Page }}
  <Page
    {kcContext}
    i18n={$i18n}
    {classes}
    {Template}
    {UserProfileFormFields}
    doUseDefaultCss={true}
    {doMakeUserConfirmPassword}
  ></Page>
{/await}
