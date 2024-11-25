<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'logout-confirm.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, client, logoutConfirm } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {@render msg('logoutConfirmTitle')()}
  {/snippet}

  <div
    id="kc-logout-confirm"
    class="content-area"
  >
    <p class="instruction">{@render msg('logoutConfirmHeader')()}</p>
    <form
      class="form-actions"
      action={url.logoutConfirmAction}
      method="POST"
    >
      <input
        type="hidden"
        name="session_code"
        value={logoutConfirm.code}
      />
      <div class={kcClsx('kcFormGroupClass')}>
        <div id="kc-form-options">
          <div class={kcClsx('kcFormOptionsWrapperClass')}></div>
        </div>
        <div
          id="kc-form-buttons"
          class={kcClsx('kcFormGroupClass')}
        >
          <input
            tabindex={4}
            class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
            name="confirmLogout"
            id="kc-logout"
            type="submit"
            value={msgStr('doLogout')}
          />
        </div>
      </div>
    </form>
    <div id="kc-info-message">
      {#if !logoutConfirm.skipLink && client.baseUrl}
        <p>
          <a href={client.baseUrl}>{@render msg('backToApplication')()}</a>
        </p>
      {/if}
    </div>
  </div>
</Template>
