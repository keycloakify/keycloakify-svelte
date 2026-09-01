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
  }: PageProps<Extract<KcContext, { pageId: 'link-idp-action.ftl' }>, I18n> = $props();

  const { kcClsx } = $derived(
    getKcClsx({
      doUseDefaultCss,
      classes,
    }),
  );

  const { idpDisplayName, url } = $derived(kcContext);

  const { msg, msgStr } = $derived($i18n);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={false}
>
  {#snippet headerNode()}
    {@render msg('linkIdpActionTitle', idpDisplayName)()}
  {/snippet}
  <div
    id="kc-link-text"
    class={kcClsx('kcContentWrapperClass')}
  >
    {@render msg('linkIdpActionMessage', idpDisplayName)()}
  </div>
  <form
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcFormGroupClass')}>
      <div
        id="kc-form-buttons"
        class={kcClsx('kcFormButtonsClass')}
      >
        <input
          class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
          name="continue"
          id="kc-continue"
          type="submit"
          value={msgStr('doContinue')}
        />
        <input
          class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
          name="cancel-aia"
          id="kc-cancel"
          type="submit"
          value={msgStr('doCancel')}
        />
      </div>
    </div>
  </form>
  <div class="clearfix"></div>
</Template>
