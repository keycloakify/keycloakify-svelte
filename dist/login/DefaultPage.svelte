<script lang="ts">
  import type { PageProps } from './pages/PageProps';
  import type { UserProfileFormFieldsProps } from './UserProfileFormFieldsProps';
  import type { Component } from 'svelte';
  import type { I18n } from './i18n';
  import type { KcContext } from './KcContext';

  type DefaultPageProps = PageProps<KcContext, I18n> & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };
  const props: DefaultPageProps = $props();
  const { kcContext: kcContext, ...rest } = props;
  const loadComponent = () => {
    switch (kcContext.pageId) {
      case 'login.ftl':
        return import('./pages/Login.svelte');

      case 'register.ftl':
        return import('./pages/Register.svelte');

      case 'info.ftl':
        return import('./pages/Login.svelte');

      case 'error.ftl':
        return import('./pages/Login.svelte');

      case 'login-reset-password.ftl':
        return import('./pages/Login.svelte');

      case 'login-verify-email.ftl':
        return import('./pages/Login.svelte');

      case 'terms.ftl':
        return import('./pages/Login.svelte');

      case 'login-oauth2-device-verify-user-code.ftl':
        return import('./pages/Login.svelte');

      case 'login-oauth-grant.ftl':
        return import('./pages/Login.svelte');

      case 'login-otp.ftl':
        return import('./pages/Login.svelte');

      case 'login-username.ftl':
        return import('./pages/Login.svelte');

      case 'webauthn-authenticate.ftl':
        return import('./pages/Login.svelte');

      case 'webauthn-register.ftl':
        return import('./pages/Login.svelte');

      case 'login-password.ftl':
        return import('./pages/Login.svelte');

      case 'login-update-password.ftl':
        return import('./pages/Login.svelte');

      case 'login-update-profile.ftl':
        return import('./pages/Login.svelte');

      case 'login-idp-link-confirm.ftl':
        return import('./pages/Login.svelte');

      case 'login-idp-link-email.ftl':
        return import('./pages/Login.svelte');

      case 'login-page-expired.ftl':
        return import('./pages/Login.svelte');

      case 'login-config-totp.ftl':
        return import('./pages/Login.svelte');

      case 'logout-confirm.ftl':
        return import('./pages/Login.svelte');

      case 'idp-review-user-profile.ftl':
        return import('./pages/Login.svelte');

      case 'update-email.ftl':
        return import('./pages/Login.svelte');

      case 'select-authenticator.ftl':
        return import('./pages/Login.svelte');

      case 'saml-post-form.ftl':
        return import('./pages/Login.svelte');

      case 'delete-credential.ftl':
        return import('./pages/Login.svelte');

      case 'code.ftl':
        return import('./pages/Code.svelte');

      case 'delete-account-confirm.ftl':
        return import('./pages/Login.svelte');

      case 'frontchannel-logout.ftl':
        return import('./pages/Login.svelte');

      case 'login-recovery-authn-code-config.ftl':
        return import('./pages/Login.svelte');

      case 'login-recovery-authn-code-input.ftl':
        return import('./pages/Login.svelte');

      case 'login-reset-otp.ftl':
        return import('./pages/Login.svelte');

      case 'login-x509-info.ftl':
        return import('./pages/Login.svelte');

      case 'webauthn-error.ftl':
        return import('./pages/Login.svelte');

      case 'login-passkeys-conditional-authenticate.ftl':
        return import('./pages/Login.svelte');

      case 'login-idp-link-confirm-override.ftl':
        return import('./pages/Login.svelte');
    }
  };
  const lazyComponent = loadComponent();
</script>

{#if lazyComponent}
  {#await lazyComponent then { default: LazyComponent }}
    <LazyComponent
      kcContext={kcContext as never}
      {...rest}
    />
  {/await}
{/if}
