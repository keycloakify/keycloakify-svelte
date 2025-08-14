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
  }: PageProps<Extract<KcContext, { pageId: 'select-authenticator.ftl' }>, I18n> = $props();
  const { url, auth } = kcContext;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
  const { msg, advancedMsg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={false}
>
  {#snippet headerNode()}
    {@render msg('loginChooseAuthenticator')()}
  {/snippet}
  <form
    id="kc-select-credential-form"
    class={kcClsx('kcFormClass')}
    action={url.loginAction}
    method="post"
  >
    <div class={kcClsx('kcSelectAuthListClass')}>
      {#each auth.authenticationSelections as authenticationSelection (authenticationSelection.authExecId)}
        <button
          class={kcClsx('kcSelectAuthListItemClass')}
          type="submit"
          name="authenticationExecution"
          value={authenticationSelection.authExecId}
        >
          <div class={kcClsx('kcSelectAuthListItemIconClass')}>
            <i class={kcClsx('kcSelectAuthListItemIconPropertyClass', authenticationSelection.iconCssClass)}></i>
          </div>
          <div class={kcClsx('kcSelectAuthListItemBodyClass')}>
            <div class={kcClsx('kcSelectAuthListItemHeadingClass')}>
              {@render advancedMsg(authenticationSelection.displayName)()}
            </div>
            <div class={kcClsx('kcSelectAuthListItemDescriptionClass')}>
              {@render advancedMsg(authenticationSelection.helpText)()}
            </div>
          </div>
          <div class={kcClsx('kcSelectAuthListItemFillClass')}></div>
          <div class={kcClsx('kcSelectAuthListItemArrowClass')}>
            <i class={kcClsx('kcSelectAuthListItemArrowIconClass')}></i>
          </div>
        </button>
      {/each}
    </div>
  </form>
</Template>
