<script lang="ts">
  import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
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
        return import('@keycloakify/svelte/login/pages/Login.svelte');

      case 'register.ftl':
        return import('@keycloakify/svelte/login/pages/Register.svelte');

      case 'info.ftl':
        return import('@keycloakify/svelte/login/pages/Info.svelte');

      case 'error.ftl':
        return import('@keycloakify/svelte/login/pages/Error.svelte');

      case 'login-reset-password.ftl':
        return import('@keycloakify/svelte/login/pages/LoginResetPassword.svelte');

      case 'login-verify-email.ftl':
        return import('@keycloakify/svelte/login/pages/LoginVerifyEmail.svelte');

      case 'terms.ftl':
        return import('@keycloakify/svelte/login/pages/Terms.svelte');

      case 'login-oauth2-device-verify-user-code.ftl':
        return import('@keycloakify/svelte/login/pages/LoginOauth2DeviceVerifyUserCode.svelte');

      case 'login-oauth-grant.ftl':
        return import('@keycloakify/svelte/login/pages/LoginOauthGrant.svelte');

      case 'login-otp.ftl':
        return import('@keycloakify/svelte/login/pages/LoginOtp.svelte');

      case 'login-username.ftl':
        return import('@keycloakify/svelte/login/pages/LoginUsername.svelte');

      case 'webauthn-authenticate.ftl':
        return import('@keycloakify/svelte/login/pages/WebauthnAuthenticate.svelte');

      case 'webauthn-register.ftl':
        return import('@keycloakify/svelte/login/pages/WebauthnRegister.svelte');

      case 'login-password.ftl':
        return import('@keycloakify/svelte/login/pages/LoginPassword.svelte');

      case 'login-update-password.ftl':
        return import('@keycloakify/svelte/login/pages/LoginUpdatePassword.svelte');

      case 'login-update-profile.ftl':
        return import('@keycloakify/svelte/login/pages/LoginUpdateProfile.svelte');

      case 'login-idp-link-confirm.ftl':
        return import('@keycloakify/svelte/login/pages/LoginIdpLinkConfirm.svelte');

      case 'login-idp-link-email.ftl':
        return import('@keycloakify/svelte/login/pages/LoginIdpLinkEmail.svelte');

      case 'login-page-expired.ftl':
        return import('@keycloakify/svelte/login/pages/LoginPageExpired.svelte');

      case 'login-config-totp.ftl':
        return import('@keycloakify/svelte/login/pages/LoginConfigTotp.svelte');

      case 'logout-confirm.ftl':
        return import('@keycloakify/svelte/login/pages/LogoutConfirm.svelte');

      case 'idp-review-user-profile.ftl':
        return import('@keycloakify/svelte/login/pages/IdpReviewUserProfile.svelte');

      case 'update-email.ftl':
        return import('@keycloakify/svelte/login/pages/UpdateEmail.svelte');

      case 'select-authenticator.ftl':
        return import('@keycloakify/svelte/login/pages/SelectAuthenticator.svelte');

      case 'saml-post-form.ftl':
        return import('@keycloakify/svelte/login/pages/SamlPostForm.svelte');

      case 'delete-credential.ftl':
        return import('@keycloakify/svelte/login/pages/DeleteCredential.svelte');

      case 'code.ftl':
        return import('@keycloakify/svelte/login/pages/Code.svelte');

      case 'delete-account-confirm.ftl':
        return import('@keycloakify/svelte/login/pages/DeleteAccountConfirm.svelte');

      case 'frontchannel-logout.ftl':
        return import('@keycloakify/svelte/login/pages/FrontchannelLogout.svelte');

      case 'login-recovery-authn-code-config.ftl':
        return import('@keycloakify/svelte/login/pages/LoginRecoveryAuthnCodeConfig.svelte');

      case 'login-recovery-authn-code-input.ftl':
        return import('@keycloakify/svelte/login/pages/LoginRecoveryAuthnCodeInput.svelte');

      case 'login-reset-otp.ftl':
        return import('@keycloakify/svelte/login/pages/LoginResetOtp.svelte');

      case 'login-x509-info.ftl':
        return import('@keycloakify/svelte/login/pages/LoginX509Info.svelte');

      case 'webauthn-error.ftl':
        return import('@keycloakify/svelte/login/pages/WebauthnError.svelte');

      case 'login-passkeys-conditional-authenticate.ftl':
        return import('@keycloakify/svelte/login/pages/LoginPasskeysConditionalAuthenticate.svelte');

      case 'login-idp-link-confirm-override.ftl':
        return import('@keycloakify/svelte/login/pages/LoginIdpLinkConfirmOverride.svelte');
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
