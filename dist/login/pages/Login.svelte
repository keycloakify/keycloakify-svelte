<script lang="ts">
  import PasswordWrapper from '../components/PasswordWrapper.svelte';
  import type { PageProps } from './PageProps';
  import { useState } from '../../tools/useState';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n> = $props();
  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

  const { msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError('username', 'password')}
  displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
>
  {#snippet headerNode()}
    {msgStr('loginAccountTitle')}
  {/snippet}

  {#snippet infoNode()}
    <div id="kc-registration-container">
      <div id="kc-registration">
        <span>
          {msgStr('noAccount')}{' '}
          <a
            tabIndex={8}
            href={url.registrationUrl}
          >
            {msgStr('doRegister')}
          </a>
        </span>
      </div>
    </div>
  {/snippet}
  {#snippet socialProvidersNode()}
    {@const providers = social?.providers}
    {#if realm.password && !!providers && !!providers.length}
      <div
        id="kc-social-providers"
        class={kcClsx('kcFormSocialAccountSectionClass')}
      >
        <hr />
        <h2>{msgStr('identity-provider-login-label')}</h2>
        <ul class={kcClsx('kcFormSocialAccountListClass', providers.length > 3 && 'kcFormSocialAccountListGridClass')}>
          {#each providers as p, i}
            <li>
              <a
                id={`social-${p.alias}`}
                class={kcClsx(
                  'kcFormSocialAccountListButtonClass',
                  providers.length > 3 && 'kcFormSocialAccountGridItem',
                )}
                type="button"
                href={p.loginUrl}
              >
                {#if p.iconClasses}
                  <i
                    class={clsx(kcClsx('kcCommonLogoIdP'), p.iconClasses)}
                    aria-hidden="true"
                  ></i>
                {/if}
                <span class={clsx(kcClsx('kcFormSocialAccountNameClass'), p.iconClasses && 'kc-social-icon-text')}
                  >{@html p.displayName}</span
                >
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/snippet}
  <div id="kc-form">
    <div id="kc-form-wrapper">
      {#if realm.password}
        <form
          id="kc-form-login"
          onsubmit={() => {
            setIsLoginButtonDisabled(true);
            return true;
          }}
          action={url.loginAction}
          method="post"
        >
          {#if !usernameHidden}
            <div class={kcClsx('kcFormGroupClass')}>
              <label
                for="username"
                class={kcClsx('kcLabelClass')}
              >
                {!realm.loginWithEmailAllowed
                  ? msgStr('username')
                  : !realm.registrationEmailAsUsername
                    ? msgStr('usernameOrEmail')
                    : msgStr('email')}
              </label>
              <input
                tabIndex={2}
                id="username"
                class={kcClsx('kcInputClass')}
                name="username"
                value={login.username ?? ''}
                type="text"
                autoFocus
                autoComplete="username"
                aria-invalid={messagesPerField.existsError('username', 'password')}
              />
              {#if messagesPerField.existsError('username', 'password')}
                <span
                  id="input-error"
                  class={kcClsx('kcInputErrorMessageClass')}
                  aria-live="polite">{@html messagesPerField.getFirstError('username', 'password')}</span
                >
              {/if}
            </div>
          {/if}

          <div class={kcClsx('kcFormGroupClass')}>
            <label
              for="password"
              class={kcClsx('kcLabelClass')}
            >
              {msgStr('password')}
            </label>
            <PasswordWrapper
              {kcClsx}
              {i18n}
              passwordInputId="password"
            >
              <input
                tabIndex={3}
                id="password"
                class={kcClsx('kcInputClass')}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={messagesPerField.existsError('username', 'password')}
              />
            </PasswordWrapper>
            {#if usernameHidden && messagesPerField.existsError('username', 'password')}
              <span
                id="input-error"
                class={kcClsx('kcInputErrorMessageClass')}
                aria-live="polite">{@html messagesPerField.getFirstError('username', 'password')}</span
              >
            {/if}
          </div>

          <div class={kcClsx('kcFormGroupClass', 'kcFormSettingClass')}>
            <div id="kc-form-options">
              {#if realm.rememberMe && !usernameHidden}
                <div class="checkbox">
                  <label>
                    <input
                      tabIndex={5}
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={!!login.rememberMe}
                    />{' '}
                    {msgStr('rememberMe')}
                  </label>
                </div>
              {/if}
            </div>
            <div class={kcClsx('kcFormOptionsWrapperClass')}>
              {#if realm.resetPasswordAllowed}
                <span>
                  <a
                    tabIndex={6}
                    href={url.loginResetCredentialsUrl}
                  >
                    {msgStr('doForgotPassword')}
                  </a>
                </span>
              {/if}
            </div>
          </div>

          <div
            id="kc-form-buttons"
            class={kcClsx('kcFormGroupClass')}
          >
            <input
              type="hidden"
              id="id-hidden-input"
              name="credentialId"
              value={auth.selectedCredential}
            />
            <input
              tabIndex={7}
              disabled={$isLoginButtonDisabled}
              class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
              name="login"
              id="kc-login"
              type="submit"
              value={msgStr('doLogIn')}
            />
          </div>
        </form>
      {/if}
    </div>
  </div>
</Template>
