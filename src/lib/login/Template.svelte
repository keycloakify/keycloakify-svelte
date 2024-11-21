<script lang="ts">
  import { useInitialize } from '@keycloakify/svelte/login/Template.useInitialize';
  import type { TemplateProps } from '@keycloakify/svelte/login/TemplateProps';
  import { useSetClassName } from '@keycloakify/svelte/tools/useSetClassName';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import type { I18n } from './i18n';
  import type { KcContext } from './KcContext';

  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  }: TemplateProps<KcContext, I18n> = $props();
  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { msgStr, currentLanguage, enabledLanguages } = i18n;

  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;
  $effect(() => {
    document.title = documentTitle ?? msgStr('loginTitle', kcContext.realm.displayName);
  });
  useSetClassName({
    qualifiedName: 'html',
    className: kcClsx('kcHtmlClass'),
  });

  useSetClassName({
    qualifiedName: 'body',
    className: bodyClassName ?? kcClsx('kcBodyClass'),
  });
  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
</script>

{#if $isReadyToRender}
  <div class={kcClsx('kcLoginClass')}>
    <div
      id="kc-header"
      class={kcClsx('kcHeaderClass')}
    >
      <div
        id="kc-header-wrapper"
        class={kcClsx('kcHeaderWrapperClass')}
      >
        {msgStr('loginTitleHtml', realm.displayNameHtml)}
      </div>
    </div>

    <div class={kcClsx('kcFormCardClass')}>
      <header class={kcClsx('kcFormHeaderClass')}>
        {#if enabledLanguages.length > 1}
          <div
            class={kcClsx('kcLocaleMainClass')}
            id="kc-locale"
          >
            <div
              id="kc-locale-wrapper"
              class={kcClsx('kcLocaleWrapperClass')}
            >
              <div
                id="kc-locale-dropdown"
                class={clsx('menu-button-links', kcClsx('kcLocaleDropDownClass'))}
              >
                <button
                  tabIndex={1}
                  id="kc-current-locale-link"
                  aria-label={msgStr('languages')}
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-controls="language-switch1"
                >
                  {currentLanguage.label}
                </button>
                <ul
                  role="menu"
                  tabIndex={-1}
                  aria-labelledby="kc-current-locale-link"
                  aria-activedescendant=""
                  id="language-switch1"
                  class={kcClsx('kcLocaleListClass')}
                >
                  {#each enabledLanguages as enabledLanguage, i}
                    {@const { label, href } = enabledLanguage}
                    <li
                      class={kcClsx('kcLocaleListItemClass')}
                      role="none"
                    >
                      <a
                        role="menuitem"
                        id={`language-${i + 1}`}
                        class={kcClsx('kcLocaleItemClass')}
                        {href}
                      >
                        {label}
                      </a>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/if}
        {#snippet node()}
          {#if !(auth !== undefined && auth.showUsername && !auth.showResetCredentials)}
            <h1 id="kc-page-title">{@render headerNode?.()}</h1>
          {:else}
            <div
              id="kc-username"
              class={kcClsx('kcFormGroupClass')}
            >
              <label id="kc-attempted-username">{auth.attemptedUsername}</label>
              <a
                id="reset-login"
                href={url.loginRestartFlowUrl}
                aria-label={msgStr('restartLoginTooltip')}
              >
                <div class="kc-login-tooltip">
                  <i class={kcClsx('kcResetFlowIcon')}></i>
                  <span class="kc-tooltip-text">{msgStr('restartLoginTooltip')}</span>
                </div>
              </a>
            </div>
          {/if}
        {/snippet}
        {#if displayRequiredFields}
          <div class={kcClsx('kcContentWrapperClass')}>
            <div class={clsx(kcClsx('kcLabelWrapperClass'), 'subtitle')}>
              <span class="subtitle">
                <span class="required">*</span>
                {msgStr('requiredFields')}
              </span>
            </div>
            <div class="col-md-10">{@render node()}</div>
          </div>
        {:else}
          {@render node()}
        {/if}
      </header>
      <div id="kc-content">
        <div id="kc-content-wrapper">
          <!-- App-initiated actions should not see warning messages about the need to complete the action during login. -->
          {#if displayMessage && message !== undefined && (message.type !== 'warning' || !isAppInitiatedAction)}
            <div
              class={clsx(
                `alert-${message.type}`,
                kcClsx('kcAlertClass'),
                `pf-m-${message?.type === 'error' ? 'danger' : message.type}`,
              )}
            >
              <div class="pf-c-alert__icon">
                {#if message.type === 'success'}
                  <span class={kcClsx('kcFeedbackSuccessIcon')}></span>
                {:else if message.type === 'warning'}
                  <span class={kcClsx('kcFeedbackWarningIcon')}></span>
                {:else if message.type === 'error'}
                  <span class={kcClsx('kcFeedbackErrorIcon')}></span>
                {:else if message.type === 'info'}
                  <span class={kcClsx('kcFeedbackInfoIcon')}></span>
                {/if}
              </div>
              <span class={kcClsx('kcAlertTitleClass')}>{@html message.summary}</span>
            </div>
          {/if}
          {@render children?.()}
          {#if auth !== undefined && auth.showTryAnotherWayLink}
            <form
              id="kc-select-try-another-way-form"
              action={url.loginAction}
              method="post"
            >
              <div class={kcClsx('kcFormGroupClass')}>
                <input
                  type="hidden"
                  name="tryAnotherWay"
                  value="on"
                />
                <a
                  href="#"
                  id="try-another-way"
                  onclick={() => {
                    document.forms['kc-select-try-another-way-form' as never].submit();
                    return false;
                  }}
                >
                  {msgStr('doTryAnotherWay')}
                </a>
              </div>
            </form>
          {/if}
          {@render socialProvidersNode?.()}
          {#if displayInfo}
            <div
              id="kc-info"
              class={kcClsx('kcSignUpClass')}
            >
              <div
                id="kc-info-wrapper"
                class={kcClsx('kcInfoAreaWrapperClass')}
              >
                {@render infoNode?.()}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
