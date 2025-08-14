<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'delete-account-confirm.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, triggered_from_aia } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {@render msg('deleteAccountConfirm')()}
  {/snippet}

  <form
    action={url.loginAction}
    class="form-vertical"
    method="post"
  >
    <div
      class="alert alert-warning"
      style:margin-top="0"
      style:margin-bottom="30px"
    >
      <span class="pficon pficon-warning-triangle-o"></span>
      {@render msg('irreversibleAction')()}
    </div>
    <p>{@render msg('deletingImplies')()}</p>
    <ul
      style:color="#72767b"
      style:list-style="disc"
      style:list-style-position="inside"
    >
      <li>{@render msg('loggingOutImmediately')()}</li>
      <li>{@render msg('errasingData')()}</li>
    </ul>
    <p class="delete-account-text">{@render msg('finalDeletionConfirmation')()}</p>
    <div id="kc-form-buttons">
      <input
        class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
        type="submit"
        value={msgStr('doConfirmDelete')}
      />
      {#if triggered_from_aia}
        <button
          class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
          style:margin-left="calc(100% - 220px)"
          type="submit"
          name="cancel-aia"
          value="true"
        >
          {msgStr('doCancel')}
        </button>
      {/if}
    </div>
  </form>
</Template>
