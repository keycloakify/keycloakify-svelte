<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login-idp-link-email.ftl' }>, I18n> = $props();

  const { url, realm, brokerContext, idpAlias } = kcContext;

  const { msg } = i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={false}
>
  {#snippet headerNode()}
    {@render msg('emailLinkIdpTitle', idpAlias)()}
  {/snippet}

  <p
    id="instruction1"
    class="instruction"
  >
    {@render msg('emailLinkIdp1', idpAlias, brokerContext.username, realm.displayName)()}
  </p>
  <p
    id="instruction2"
    class="instruction"
  >
    {@render msg('emailLinkIdp2')()} <a href={url.loginAction}>{@render msg('doClickHere')()}</a>
    {@render msg('emailLinkIdp3')()}
  </p>
  <p
    id="instruction3"
    class="instruction"
  >
    {@render msg('emailLinkIdp4')()} <a href={url.loginAction}>{@render msg('doClickHere')()}</a>
    {@render msg('emailLinkIdp5')()}
  </p>
</Template>
