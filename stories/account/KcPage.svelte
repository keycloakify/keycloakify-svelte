<script lang="ts">
  import Template from '@keycloakify/svelte/account/Template.svelte';
  import type { KcContext } from 'keycloakify/account/KcContext';
  import type { ClassKey } from 'keycloakify/account/lib/kcClsx';
  import type { Component } from 'svelte';
  import { useI18n } from './i18n';

  const { kcContext }: { kcContext: KcContext } = $props();

  const { i18n } = useI18n({ kcContext });

  const classes = {} satisfies { [key in ClassKey]?: string };

  const page = async (): Promise<{ default?: Component<any> }> => {
    switch (kcContext.pageId) {
      default:
        return import('@keycloakify/svelte/account/DefaultPage.svelte');
    }
  };
</script>

{#await page() then { default: Page }}
  <Page
    {kcContext}
    {i18n}
    {classes}
    {Template}
    doUseDefaultCss={true}
  ></Page>
{/await}
