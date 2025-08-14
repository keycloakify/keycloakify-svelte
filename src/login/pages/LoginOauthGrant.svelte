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
  }: PageProps<Extract<KcContext, { pageId: 'login-oauth-grant.ftl' }>, I18n> = $props();

  const { url, oauth, client } = kcContext;

  const { msg, msgStr, advancedMsg, advancedMsgStr } = $i18n;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  bodyClassName="oauth"
>
  {#snippet headerNode()}
    {#if client.attributes.logoUri}
      <img
        src={client.attributes.logoUri}
        alt="logo"
      />
    {/if}
    <p>
      {@render (client.name
        ? msg('oauthGrantTitle', advancedMsgStr(client.name))
        : msg('oauthGrantTitle', client.clientId))()}
    </p>
  {/snippet}
  <div
    id="kc-oauth"
    class="content-area"
  >
    <h3>{@render msg('oauthGrantRequest')()}</h3>
    <ul>
      {#each oauth.clientScopesRequested as clientScope, i (i)}
        <li>
          <span>
            {@render advancedMsg(clientScope.consentScreenText)()}
            {#if clientScope.dynamicScopeParameter}
              : <b>{clientScope.dynamicScopeParameter}</b>
            {/if}
          </span>
        </li>
      {/each}
    </ul>

    {#if client.attributes.policyUri || client.attributes.tosUri}
      <h3>
        {@render (client.name
          ? msg('oauthGrantInformation', advancedMsgStr(client.name))
          : msg('oauthGrantInformation', client.clientId))()}
        {#if client.attributes.tosUri}
          {@render msg('oauthGrantReview')()}
          <a
            href={client.attributes.tosUri}
            target="_blank"
          >
            {@render msg('oauthGrantTos')()}
          </a>
        {/if}
        {#if client.attributes.policyUri}
          {@render msg('oauthGrantReview')()}
          <a
            href={client.attributes.policyUri}
            target="_blank"
          >
            {@render msg('oauthGrantPolicy')()}
          </a>
        {/if}
      </h3>
    {/if}

    <form
      class="form-actions"
      action={url.oauthAction}
      method="POST"
    >
      <input
        type="hidden"
        name="code"
        value={oauth.code}
      />
      <div class={kcClsx('kcFormGroupClass')}>
        <div id="kc-form-options">
          <div class={kcClsx('kcFormOptionsWrapperClass')}></div>
        </div>

        <div id="kc-form-buttons">
          <div class={kcClsx('kcFormButtonsWrapperClass')}>
            <input
              class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
              name="accept"
              id="kc-login"
              type="submit"
              value={msgStr('doYes')}
            />
            <input
              class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
              name="cancel"
              id="kc-cancel"
              type="submit"
              value={msgStr('doNo')}
            />
          </div>
        </div>
      </div>
    </form>
    <div class="clearfix"></div>
  </div>
</Template>
