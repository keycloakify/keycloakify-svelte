<script lang="ts">
  import type { Component } from 'svelte';
  import type { KcContext } from './kc.gen';

  const { kcContext, Fallback }: { kcContext: KcContext; Fallback?: Component } = $props();

  const KcLoginPage = import('./login/KcPage.svelte');
</script>

{#if kcContext.themeType === 'login'}
  {#await KcLoginPage}
    {#if Fallback}
      <Fallback></Fallback>
    {/if}
  {:then { default: KcPage }}
    <KcPage {kcContext} />
  {/await}
{:else if kcContext.themeType === 'account'}
  <!-- account not implemented -->
{/if}
