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
  }: PageProps<Extract<KcContext, { pageId: 'delete-credential.ftl' }>, I18n> = $props();

  const { msgStr, msg } = $i18n;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, credentialLabel } = kcContext;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={false}
>
  {#snippet headerNode()}
    {@render msg('deleteCredentialTitle', credentialLabel)()}
  {/snippet}

  <div id="kc-delete-text">{@render msg('deleteCredentialMessage', credentialLabel)()}</div>
  <form
    class="form-actions"
    action={url.loginAction}
    method="POST"
  >
    <input
      class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
      name="accept"
      id="kc-accept"
      type="submit"
      value={msgStr('doConfirmDelete')}
    />
    <input
      class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
      name="cancel-aia"
      value={msgStr('doCancel')}
      id="kc-decline"
      type="submit"
    />
  </form>
  <div class="clearfix"></div>
</Template>
