<script lang="ts">
  import { useInitialize } from '@keycloakify/svelte/account/Template.useInitialize';
  import type { TemplateProps } from '@keycloakify/svelte/account/TemplateProps';
  import { useSetClassName } from '@keycloakify/svelte/tools/useSetClassName';
  import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import { onMount } from 'svelte';
  import type { I18n } from './i18n';
  import type { KcContext } from './KcContext';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';

  const { kcContext, i18n, doUseDefaultCss, active, classes, children }: TemplateProps<KcContext, I18n> = $props();
  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { msg, msgStr, currentLanguage, enabledLanguages } = $i18n;

  const { url, features, realm, message, referrer } = kcContext;

  onMount(() => {
    document.title = msgStr('accountManagementTitle');
  });

  useSetClassName({
    qualifiedName: 'html',
    className: kcClsx('kcHtmlClass'),
  });

  useSetClassName({
    qualifiedName: 'body',
    className: clsx('admin-console', 'user', kcClsx('kcBodyClass')),
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
</script>

{#if $isReadyToRender}
  <header class="navbar navbar-default navbar-pf navbar-main header">
    <!-- svelte-ignore a11y_no_redundant_roles -->
    <nav
      class="navbar"
      role="navigation"
    >
      <div class="navbar-header">
        <div class="container">
          <h1 class="navbar-title">Keycloak</h1>
        </div>
      </div>
      <div class="navbar-collapse navbar-collapse-1">
        <div class="container">
          <ul class="nav navbar-nav navbar-utility">
            {#if enabledLanguages.length}
              <li>
                <div
                  class="kc-dropdown"
                  id="kc-locale-dropdown"
                >
                  <!-- svelte-ignore a11y_invalid_attribute -->
                  <a
                    href="#"
                    id="kc-current-locale-link"
                  >
                    {currentLanguage.label}
                  </a>
                  <ul>
                    {#each enabledLanguages as { label, href, languageTag } (languageTag)}
                      <li class="kc-dropdown-item">
                        <a {href}>{label}</a>
                      </li>
                    {/each}
                  </ul>
                </div>
              </li>
            {/if}
            {#if referrer?.url}
              <li>
                <a
                  href={referrer.url}
                  id="referrer"
                >
                  {@render msg('backTo', referrer.name)()}
                </a>
              </li>
            {/if}
            <li>
              <a href={url.getLogoutUrl()}>{@render msg('doSignOut')()}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <div class="container">
    <div class="bs-sidebar col-sm-3">
      <ul>
        <li class={clsx(active === 'account' && 'active')}>
          <a href={url.accountUrl}>{@render msg('account')()}</a>
        </li>
        {#if features.passwordUpdateSupported}
          <li class={clsx(active === 'password' && 'active')}>
            <a href={url.passwordUrl}>{@render msg('password')()}</a>
          </li>
        {/if}
        <li class={clsx(active === 'totp' && 'active')}>
          <a href={url.totpUrl}>{@render msg('authenticator')()}</a>
        </li>
        {#if features.identityFederation}
          <li class={clsx(active === 'social' && 'active')}>
            <a href={url.socialUrl}>{@render msg('federatedIdentity')()}</a>
          </li>
        {/if}
        <li class={clsx(active === 'sessions' && 'active')}>
          <a href={url.sessionsUrl}>{@render msg('sessions')()}</a>
        </li>
        <li class={clsx(active === 'applications' && 'active')}>
          <a href={url.applicationsUrl}>{@render msg('applications')()}</a>
        </li>
        {#if features.log}
          <li class={clsx(active === 'log' && 'active')}>
            <a href={url.logUrl}>{@render msg('log')()}</a>
          </li>
        {/if}
        {#if realm.userManagedAccessAllowed && features.authorization}
          <li class={clsx(active === 'authorization' && 'active')}>
            <a href={url.resourceUrl}>{@render msg('myResources')()}</a>
          </li>
        {/if}
      </ul>
    </div>

    <div class="col-sm-9 content-area">
      {#if message !== undefined}
        <div class={clsx('alert', `alert-${message.type}`)}>
          {#if message.type === 'success'}<span class="pficon pficon-ok"></span>{/if}
          {#if message.type === 'error'}<span class="pficon pficon-error-circle-o"></span>{/if}
          <span class="kc-feedback-text">{@html kcSanitize(message.summary)}</span>
        </div>
      {/if}

      {@render children?.()}
    </div>
  </div>
{/if}
